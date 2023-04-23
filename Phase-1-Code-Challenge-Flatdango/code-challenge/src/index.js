// Define constants for API endpoint and DOM elements
const FILM_API_ENDPOINT = "http://localhost:3000/films";
const filmListElement = document.getElementById("films");
const previewImageElement = document.getElementById("poster");
const movieTitleElement = document.getElementById("title");
const movieTimeElement = document.getElementById("time");
const movieDescriptionElement = document.getElementById("film-info");
const showTimeElement = document.getElementById("showtime");
const movieTicketsAvailableElement = document.getElementById("ticket-num");
const buyTicketButton = document.getElementById("buy-ticket");

// Wait for DOM to load before fetching data
document.addEventListener("DOMContentLoaded", () => {
  // Remove first placeholder film item from the list
  const firstFilmItem = document.getElementsByClassName("film item")[0];
  firstFilmItem.remove();
  
  // Fetch movies from server
  fetchMovies(FILM_API_ENDPOINT);
});

// Fetches movies from server
function fetchMovies(endpoint) {
  fetch(endpoint)
    .then(response => response.json())
    .then(movies => {
      // Display each movie in the list
      movies.forEach(movie => displayMovie(movie));
      // Add click event listener to each movie item
      addClickEventListenerToMovies();
    })
    .catch(error => console.log(`Error fetching movies: ${error}`));
}

// Displays a movie item in the list
function displayMovie(movie) {
  const movieItem = document.createElement("li");
  movieItem.style.cursor = "pointer";
  movieItem.textContent = movie.title.toUpperCase();
  filmListElement.appendChild(movieItem);
}

// Adds click event listener to each movie item in the list
function addClickEventListenerToMovies() {
  const movieItems = document.querySelectorAll("#films > li");
  movieItems.forEach((movieItem, index) => {
    movieItem.addEventListener("click", () => {
      const movieEndpoint = `${FILM_API_ENDPOINT}/${index + 1}`;
      // Fetch movie details from server and display them
      fetch(movieEndpoint)
        .then(response => response.json())
        .then(movie => {
          displayMovieDetails(movie);
          setAvailableTicketsCount(movie);
        })
        .catch(error => console.log(`Error fetching movie details: ${error}`));
    });
  });
}

// Displays the details of the selected movie
function displayMovieDetails(movie) {
  previewImageElement.src = movie.poster;
  movieTitleElement.textContent = movie.title;
  movieTimeElement.textContent = `${movie.runtime} minutes`;
  movieDescriptionElement.textContent = movie.description;
  showTimeElement.textContent = movie.showtime;
}

// Sets the available tickets count for the selected movie
function setAvailableTicketsCount(movie) {
  const availableTicketsCount = movie.capacity - movie.tickets_sold;
  movieTicketsAvailableElement.textContent = availableTicketsCount;
  if (availableTicketsCount === 0) {
    buyTicketButton.textContent = "Sold Out";
  } else {
    buyTicketButton.textContent = "Buy Ticket";
  }
}

// Adds click event listener to buy ticket button
buyTicketButton.addEventListener("click", event => {
    event.preventDefault();
    let remainingTicketsCount = parseInt(movieTicketsAvailableElement.textContent);
    if (remainingTicketsCount > 0) {
      remainingTicketsCount--;
      movieTicketsAvailableElement.textContent = remainingTicketsCount;
    } else {
      buyTicketButton.textContent = "Sold Out";
    }
  });