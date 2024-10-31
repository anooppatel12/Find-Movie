import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const defaultMovieIDs = ["tt0120338", "tt0111161", "tt0068646"]; // Add more movie IDs as needed
  const [endPoints, setEndPoints] = useState(defaultMovieIDs);
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMoviesData();
  }, []);

  const fetchMoviesData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedMovies = await Promise.all(endPoints.map(async (endPoint) => {
        const url = `https://imdb-com.p.rapidapi.com/title/get-taglines?tconst=${endPoint}`;
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': '54c72f3614msh94a3c1227b434ffp154f9ajsna5e94a0c2afb',
            'x-rapidapi-host': 'imdb-com.p.rapidapi.com',
          },
        };
        
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        return result.data.title;
      }));

      setMovieData(fetchedMovies);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (e) => {
    setEndPoints([e.target.value]); // Update to allow single movie ID input
  };

  const submitHandler = (e) => {
    e.preventDefault();
    fetchMoviesData(); // Fetch data on submit
  };

  return (
    <div className="App">
      <div className="form-container">
        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Enter Movie ID (e.g., tt0120338)"
            onChange={onChangeHandler}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">Error: {error}</p>}

      <div className="movie-list">
        {movieData.map((movie, index) => (
          <div key={index} className="movie-details">
            <h2 className="movie-title">{movie.titleText.text}</h2>
            <img
              src={movie.primaryImage.url}
              alt={movie.titleText.text}
              className="movie-image"
            />
            <h3>Taglines:</h3>
            <ul className="tagline-list">
              {movie.taglines.edges.map((tagline, index) => (
                <li key={index}>{tagline.node.text}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
