import requests
import io
import sys
import json
import sqlite3
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from sklearn.preprocessing import StandardScaler
import ast
import os

# Get the current script directory
script_dir = os.path.dirname(os.path.abspath(__file__))
# Define the path to the SQLite database file
db_path = os.path.join(script_dir, "../database.sqlite3")

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cur = conn.cursor()
genres = {
    12: "Adventure",
    14: "Fantasy",
    16: "Animation",
    18: "Drama",
    27: "Horror",
    28: "Action",
    35: "Comedy",
    36: "History",
    37: "Western",
    53: "Thriller",
    80: "Crime",
    99: "Documentary",
    878: "Science_fiction",
    9648: "Mystery",
    10402: "Music",
    10749: "Romance",
    10751: "Family",
    10752: "War",
    10770: "TV_movie",
}
num_movies = 0
cur.execute("SELECT Genre FROM Movies")
movies = [json.loads(row[0]) for row in cur.fetchall()]

# Initialize the matrix
num_movies = len(movies)


def calculate_average_rating(id_user):
    # Get the list of movie IDs from the Movies table in the order they appear
    cur.execute("SELECT id FROM Movies")
    movie_ids = [row[0] for row in cur.fetchall()]

    # Get the total number of movies
    num_movies = len(movie_ids)

    # Initialize a vector of zeros with the length of the total number of movies
    user_vector = np.zeros(num_movies)

    # Get the ratings for user with id_user
    cur.execute(f"SELECT id_movie, rating FROM Rating WHERE id_user = {id_user}")
    user_ratings = cur.fetchall()

    # Create a dictionary for quick lookup of ratings
    rating_dict = {movie_id: rating for movie_id, rating in user_ratings}

    # Populate the user_vector with the ratings based on the order of movie_ids
    for idx, movie_id in enumerate(movie_ids):
        if movie_id in rating_dict:
            user_vector[idx] = rating_dict[movie_id]
    # Print the length of the user_vector to verify
    print(len(user_vector))

    # Print the user_vector to verify the ratings
    print(user_vector)
    # Close the database connection

    # Get the ratings and genres for movies rated by user_id 1
    cur.execute(
        f"""
        SELECT m.Genre, r.rating
        FROM Movies m
        JOIN Rating r ON m.id = r.id_movie
        WHERE r.id_user = {id_user}
    """
    )
    user_ratings = cur.fetchall()

    # Initialize a dictionary to store total ratings and counts for each genre
    genre_ratings = {
        genre: {"total_rating": 0, "count": 0} for genre in genres.values()
    }

    # Calculate total ratings and counts for each genre
    for genre_list, rating in user_ratings:
        genre_ids = json.loads(
            genre_list
        )  # Convert JSON string back to list of genre ids
        for genre_id in genre_ids:
            genre_name = genres.get(genre_id)
            if genre_name:
                genre_ratings[genre_name]["total_rating"] += rating
                genre_ratings[genre_name]["count"] += 1

    # Calculate average ratings for each genre
    average_genre_ratings = {
        genre: (
            round((info["total_rating"] / info["count"]), 2) if info["count"] > 0 else 0
        )
        for genre, info in genre_ratings.items()
    }
    # Update the Users table with the average ratings for each genre for user_id 1
    update_query = """
        UPDATE Users
        SET Adventure = ?,
            Fantasy = ?,
            Animation = ?,
            Drama = ?,
            Horror = ?,
            Action = ?,
            Comedy = ?,
            History = ?,
            Western = ?,
            Thriller = ?,
            Crime = ?,
            Documentary = ?,
            Science_fiction = ?,
            Mystery = ?,
            Music = ?,
            Romance = ?,
            Family = ?,
            War = ?,
            TV_movie = ?
        WHERE id = ?
    """

    cur.execute(
        update_query,
        [
            average_genre_ratings["Adventure"],
            average_genre_ratings["Fantasy"],
            average_genre_ratings["Animation"],
            average_genre_ratings["Drama"],
            average_genre_ratings["Horror"],
            average_genre_ratings["Action"],
            average_genre_ratings["Comedy"],
            average_genre_ratings["History"],
            average_genre_ratings["Western"],
            average_genre_ratings["Thriller"],
            average_genre_ratings["Crime"],
            average_genre_ratings["Documentary"],
            average_genre_ratings["Science_fiction"],
            average_genre_ratings["Mystery"],
            average_genre_ratings["Music"],
            average_genre_ratings["Romance"],
            average_genre_ratings["Family"],
            average_genre_ratings["War"],
            average_genre_ratings["TV_movie"],
            id_user,
        ],
    )
    return user_vector


def adj_mat():
    global num_movies
    # Get the movie data
    cur.execute("SELECT Genre FROM Movies")
    movies = [json.loads(row[0]) for row in cur.fetchall()]

    # Initialize the matrix
    num_movies = len(movies)
    num_genres = len(genres)
    movie_train = np.zeros((num_movies, num_genres), dtype=int)

    # Create a mapping from genre ID to column index
    genre_to_index = {genre_id: index for index, genre_id in enumerate(genres.keys())}

    # Populate the matrix
    for i, movie_genres in enumerate(movies):
        for genre_id in movie_genres:
            if genre_id in genre_to_index:
                movie_train[i, genre_to_index[genre_id]] = 1
    movie_train = np.array(movie_train)
    # return the genre matrix
    movie_train_normal = movie_train / (
        np.sum(movie_train, axis=1, keepdims=True) + 10e-4
    )
    return movie_train_normal


def replicate_list(input_list, n):
    return [input_list] * n


def get_traning_data(id_user):
    cur.execute(f"SELECT * FROM Users WHERE id={id_user}")
    user_data = cur.fetchone()
    user_data = replicate_list(user_data[1:], num_movies)
    user_train = np.array(user_data)
    return user_train


def NN_training(id_user):
    global scaler_user
    global scaler_movie
    global scaler_y
    num_user_features = len(genres)
    num_item_features = len(genres)
    user_train = get_traning_data(id_user)
    user_vector = calculate_average_rating(id_user)
    movie_train = adj_mat()
    y_train = user_vector.reshape(-1, 1)

    scaler_user = StandardScaler()
    scaler_movie = StandardScaler()
    scaler_y = StandardScaler()

    scaler_user.fit(user_train)
    scaler_movie.fit(movie_train)
    scaler_y.fit(y_train)

    user_train_n = scaler_user.transform(user_train)
    movie_train_n = scaler_movie.transform(movie_train)
    y_train_n = scaler_y.transform(y_train)

    user_NN = Sequential(
        [
            tf.keras.layers.Dense(64, activation="relu"),
            tf.keras.layers.Dense(32, activation="relu"),
            tf.keras.layers.Dense(19, activation="linear"),
        ]
    )

    movie_NN = Sequential(
        [
            tf.keras.layers.Dense(64, activation="relu"),
            tf.keras.layers.Dense(32, activation="relu"),
            tf.keras.layers.Dense(19, activation="linear"),
        ]
    )

    # Create the user input and point to the base network
    input_user = tf.keras.layers.Input(shape=(num_user_features,))
    vu = user_NN(input_user)
    vu = tf.keras.layers.Lambda(lambda x: tf.linalg.l2_normalize(x, axis=1))(vu)

    # Create the item input and point to the base network
    input_item = tf.keras.layers.Input(shape=(num_item_features,))
    vm = movie_NN(input_item)
    vm = tf.keras.layers.Lambda(lambda x: tf.linalg.l2_normalize(x, axis=1))(vm)

    # Measure the similarity of the two vector outputs
    output = tf.keras.layers.Dot(axes=1)([vu, vm])

    # Specify the inputs and output of the model
    model = tf.keras.models.Model([input_user, input_item], output)

    # Specify the cost function
    cost_fn = tf.keras.losses.MeanSquaredError()

    # Compile the model
    model.compile(optimizer="adam", loss=cost_fn)

    tf.random.set_seed(1)
    cost_fn = tf.keras.losses.MeanSquaredError()
    opt = tf.keras.optimizers.Adam(learning_rate=0.01)
    model.compile(optimizer=opt, loss=cost_fn)

    # Display the model summary
    model.fit([user_train_n, movie_train_n], y_train_n, epochs=10, verbose=0)
    return model


def get_top_n_indexes(arr, n):
    # Get the indexes that would sort the array in decreasing order
    sorted_indexes = np.argsort(arr)[::-1]
    # Select the first n indexes
    top_n_indexes = sorted_indexes[:n]
    return top_n_indexes


def recommend(id_user, n=50):
    cur.execute("SELECT * FROM Movies")
    movies_list = cur.fetchall()
    # Predict scores for all movies
    model = NN_training(id_user)
    user_train = get_traning_data(id_user)
    movie_train = adj_mat()
    user_train_n = scaler_user.transform(user_train)
    movie_train_n = scaler_movie.transform(movie_train)

    y_predict = model.predict([user_train_n, movie_train_n])
    y_predict = np.squeeze(y_predict)

    cur.execute(f"SELECT id_movie FROM Rating WHERE id_user = {id_user}")
    id_movies_watched = cur.fetchall()
    id_movies_watched = [ids[0] for ids in id_movies_watched]

    top_n_indexes = get_top_n_indexes(y_predict, len(y_predict))

    unwatched_movie_indexes = [
        i for i in top_n_indexes if movies_list[i][0] not in id_movies_watched
    ][:n]
    recommendations = {"page": 1, "results": []}

    for rank, i in enumerate(unwatched_movie_indexes, start=1):
        genres_list = [j for j in ast.literal_eval(movies_list[i][2])]
        movie_info = {
            "id": movies_list[i][0],
            "rank": rank,
            "genre_ids": genres_list,
            "title": movies_list[i][1],
        }
        recommendations["results"].append(movie_info)

    # Get the current script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Define the path to save the JSON file
    json_path = os.path.join(script_dir, "recommendations.json")

    with open(json_path, "w") as json_file:
        json.dump(recommendations, json_file, indent=4)
        print(f"Recommendations have been written to {json_path}")


recommend(1, 100)
conn.commit()
conn.close()


if __name__ == "__main__":

    recommend()
