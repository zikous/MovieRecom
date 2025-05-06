export interface Movie {
  id: number
  title: string
  overview?: string
  poster_path?: string
  vote_average?: number
  genres?: string
}

export enum RatingValue {
  HALF = 0.5,
  ONE = 1.0,
  ONE_HALF = 1.5,
  TWO = 2.0,
  TWO_HALF = 2.5,
  THREE = 3.0,
  THREE_HALF = 3.5,
  FOUR = 4.0,
  FOUR_HALF = 4.5,
  FIVE = 5.0,
}

export interface Rating {
  id: number
  user_id: number
  movie_id: number
  rating: RatingValue
}
