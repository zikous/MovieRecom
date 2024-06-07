import express from 'express';
import { appDataSource } from '../datasource.js';
import Rating from '../entities/rating.js';


const router = express.Router();

router.post('/rate', async (req, res) => {
    const { id_user, id_movie, rating } = req.body; 
    const RatingRep = appDataSource.getRepository(Rating);
    const rating_ = await RatingRep.findOne({ where: { id_user: id_user, id_movie: id_movie } });

    if (rating_) {
        rating_.rating = rating;
        await RatingRep.save(rating_);
        res.status(200).json({
            message: 'Successfully updated',
            id: rating_.id
        });
    } else {
        const newRating = RatingRep.create({
            id_user: id_user,
            id_movie: id_movie,
            rating: rating
        });
        await RatingRep.save(newRating);
        res.status(201).json({
            message: 'Rating successfully added'
        });
    }
});

router.post('/movie', async (req, res) => {
    const { title, date } = req.body;
    const MovieRep = appDataSource.getRepository(Movie);
    const newMovie = MovieRep.create({
        title: title,
        date: date
    });
    await MovieRep.save(newMovie)
        .then((savedMovie) => {
            res.status(201).json({
                message: 'Movie successfully added',
                id: savedMovie.id
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: 'Error adding movie',
                error: error.message
            });
        });
});

export default router;
