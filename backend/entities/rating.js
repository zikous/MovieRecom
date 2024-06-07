import { EntitySchema } from 'typeorm';

const Rating = new EntitySchema({
  name: 'Rating',
  columns: {
    id_user: {
      primary: true,
      type: Number,
    },
    id_movie: {
      primary: true,
      type: Number,
    },
    rating: {
      type: Number,
    },
  },
});

export default Rating;