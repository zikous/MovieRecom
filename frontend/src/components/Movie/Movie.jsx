import axios from 'axios';
import './Movie.css';


function MovieTable({ Movies }) {
  // const deleteUser = (userId) => {
  //   axios
  //     .delete(⁠ ${import.meta.env.VITE_BACKEND_URL}/users/${userId} ⁠)
  //     .then(() => onSuccessfulUserDeletion());
  // };

  return (
    <div>
      <table className="Movie">
        <thead>
          <tr>
            <th>titre</th>
            <th>date de sortie</th>
            {/* <th>Last name</th> */}
          </tr>
        </thead>
        <tbody>
          {Movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.title}</td>
              <td>{movie.release_date}</td>
              {/* <td>{user.lastname}</td> */}
              {/* <td>
                <button onClick={() => deleteUser(movie.id)}>Delete</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MovieTable;