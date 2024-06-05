import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movie.js';



const router = express.Router()

router.get('/:id', async function (req, res) {
    const MovieRep = appDataSource.getRepository(Movie);
    const movieId = req.params.id;

    try {
        const movies = await MovieRep.find({
            where: {
                id: movieId
            },
            select: {
                title: true,
                date: true
            }
        });

        if (movies) {
            res.json(movies);
        } else {
            res.status(404).json({ error: 'Failed to fetch movie' });

        }
       
    } catch (error) {
        res.status(404).json({ error: 'Failed to fetch movie' });
    }
        
   
  });
//   router.delete('/delete/:MovieId', function (req, res) {
//     appDataSource
//       .getRepository(Movie)
//       .delete({ id: req.params.MovieId })
//       .then(function () {
//         res.status(204).json({ message: 'Movie successfully deleted' });
//       })
//       .catch(function () {
//         res.status(500).json({ message: 'Error while deleting the Movie' });
//       });
//   });
router.delete('/:id', async function (req, res) {
    const MovieRep = appDataSource.getRepository(Movie);
    const movieId = req.params.id;

    try {
        const movies = await MovieRep.findOne({
            where: {
                id: movieId
            }
        });

        if (movies) {
            await MovieRep.remove(movies);
            res.status(200).json({ message: 'Movie succefully deleted' });
        } else {
            res.status(404).json({ error: 'Movie not found' });

        }
       
    } catch (error) {
        res.status(404).json({ error: 'Failed to fetch movie' });
    }
        
   
  });

router.post('/new', function (req, res) {
    console.log(req.body)
    const MovieRep = appDataSource.getRepository(Movie);
    const newMovie = MovieRep.create({
        title: req.body.title,
        date: req.body.date,
    });
    MovieRep
    .save(newMovie)
    .then(function (savedMovie) {
      res.status(201).json({
        message: 'Movie successfully Added',
        id: savedMovie.id,
      });
    })
    // res.json(newMovie.date)
});

export default router;