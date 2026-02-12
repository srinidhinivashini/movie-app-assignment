const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3001;

app.use(express.json());

const MOVIE_DATA_PATH = path.join(__dirname, 'movies_metadata.json');

const getMoviesData = () => {
  try {
    const rawData = fs.readFileSync(MOVIE_DATA_PATH);
    return JSON.parse(rawData);
  } catch (error) { return []; }
};

app.get("/api/movies", (req, res) => {
  const movies = getMoviesData();
  const simplifiedList = movies.map(movie => ({
    id: movie.id,
    title: movie.title,
    tagline: movie.tagline,
    vote_average: movie.vote_average,
    poster_path: movie.poster_path
  }));
  res.json(simplifiedList);
});

app.get("/api/movies/:id", (req, res) => {
  const movies = getMoviesData();
  const movie = movies.find(m => m.id == req.params.id);
  if (movie) res.json(movie);
  else res.status(404).json({ message: "Movie not found" });
});

app.listen(port, () => console.log("Server running on port", port));