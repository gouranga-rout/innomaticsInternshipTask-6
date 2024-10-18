let APIKey = "ec958024";
let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchBtn");
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let ratingsReviews = JSON.parse(localStorage.getItem('ratingsReviews')) || {};

// Function to fetch and display movie data in the searched section
const displayMovieDetails = async (movieTitle) => {
  try {
    let fetchData = await fetch(`https://www.omdbapi.com/?apikey=${APIKey}&t=${movieTitle}`);
    let movieDetails = await fetchData.json();

    if (movieDetails.Response === "False") {
      document.querySelector("#movieCardSection").innerHTML = "<p style='color:red; font-size: 1rem;'>Enter a valid movie name</p>";
      return;
    }

    document.querySelector("#movieCardSection").innerHTML = "";
    searchInput.value = "";

    let div = document.createElement("div");
    div.classList.add("movieCard");
    div.innerHTML = `
      <img src="${movieDetails.Poster}" alt="">
      <div class="cardText">
        <h1>${movieDetails.Title}</h1>
        <p class="rating">Ratings: <span>${movieDetails.Ratings[0]?.Value || 'N/A'}</span></p>
	<a href="#">${movieDetails.Genre}</a>
        <p>Release: <span>${movieDetails.Released}</span></p>
        <p>Duration: <span>${movieDetails.Runtime}</span></p>
        <p>Description: <span>${movieDetails.Plot}</span></p>
        <button class="addToFavBtn">Add to Favorites</button>
        <p>Rating this movie: <input type="number" id="ratingInput" placeholder="1-10" min="1" max="10" value="${ratingsReviews[movieDetails.imdbID]?.rating || ''}"></p>
        <p>Your Feedback: <input type="text" id="reviewInput" placeholder="Write a review" value="${ratingsReviews[movieDetails.imdbID]?.review || ''}"></p>
        <button class="saveReviewBtn">Save Rating & Review</button>
      </div>
    `;

    if (favorites.find(fav => fav.imdbID === movieDetails.imdbID)) {
      div.querySelector('.addToFavBtn').innerText = "Remove from Favorites";
      div.querySelector('.addToFavBtn').classList.add('in-favorites');
    }

    document.querySelector("#movieCardSection").appendChild(div);

    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });


    div.querySelector('.saveReviewBtn').addEventListener('click', () => {
      let rating = div.querySelector('#ratingInput').value;
      let review = div.querySelector('#reviewInput').value;

      ratingsReviews[movieDetails.imdbID] = { rating, review };
      localStorage.setItem('ratingsReviews', JSON.stringify(ratingsReviews));
      alert('Rating and review saved!');
    });


    div.querySelector('.addToFavBtn').addEventListener('click', function() {
      if (favorites.find(fav => fav.imdbID === movieDetails.imdbID)) {
        removeFromFavorites(movieDetails);
        div.querySelector('.addToFavBtn').innerText = "Add to Favorites";
        div.querySelector('.addToFavBtn').classList.remove('in-favorites');
      } else {
        addToFavorites(movieDetails);
        div.querySelector('.addToFavBtn').innerText = "Remove from Favorites";
        div.querySelector('.addToFavBtn').classList.add('in-favorites');
      }
    });
  } catch (error) {
    document.querySelector("#movieCardSection").innerHTML = "<h1>Error fetching data</h1>";
  }
};

// Add movie to favorites
const addToFavorites = (movie) => {
  if (!favorites.find(fav => fav.imdbID === movie.imdbID)) {
    favorites.push(movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert(`${movie.Title} added to your favorites!`);
    displayFavorites();
  } else {
    alert(`${movie.Title} is already in your favorites!`);
  }
};

// Remove movie from favorites
const removeFromFavorites = (movie) => {
  favorites = favorites.filter(fav => fav.imdbID !== movie.imdbID);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert(`${movie.Title} removed from your favorites!`);
  displayFavorites();
};

// Display favorite movies
const displayFavorites = () => {
  let favoritesList = document.querySelector("#favoritesList");
  favoritesList.innerHTML = "";  // Clear previous list

  favorites.forEach(movie => {
    let div = document.createElement("div");
    div.classList.add("movieCard");
    div.innerHTML =  `
      <img src="${movie.Poster}" alt="">
      <div class="cardText">
        <h1>${movie.Title}</h1>
        <p class="rating">Ratings: <span>${movie.Ratings[0]?.Value || 'N/A'}</span></p>
	<a href="#">${movie.Genre}</a>
        <p>Release : <span>${movie.Released}</span></p>
	<p>Duration : <span>${movie.Runtime}</span></p>
        <p>Description : <span>${movie.Plot}</span></p>
        <button class="removeFromFavBtn">Remove from Favorites</button>
      </div>
    `;
    favoritesList.appendChild(div);

    // Click on poster to show full details
    div.addEventListener('click', () => {
      displayMovieDetails(movie.Title); // Pass the exact movie title
    });
  });
};


// Display pre-fixed movies on home screen
const displayPreFixedMovies = async () => {
  const preFixedMovies = [
                'Avengers: Endgame',
                'Spider-Man: No Way Home',
                'Iron Man 3',
                'Spider-Man: Far from Home',
                'Krrish 3',
                'Trisha On The Rocks',
                'Dhruva',
                'Devara: Part 1',
                'Business Man'

  ];

  for (let movie of preFixedMovies) {
    let fetchData = await fetch(`https://www.omdbapi.com/?apikey=${APIKey}&t=${movie}`);
    let jsonData = await fetchData.json();

    let div = document.createElement("div");
    div.classList.add("movieCard");
    div.innerHTML = `
      <img src=${jsonData.Poster} alt="">
      <div class="cardText">
       <h1>${jsonData.Title}</h1>
        <p class="rating">Ratings: <span>${jsonData.Ratings[0]?.Value || 'N/A'}</span></p>
        <a href="#">${jsonData.Genre}</a>
        <p>Release: <span>${jsonData.Released}</span></p>
        <p>Duration: <span>${jsonData.Runtime}</span></p>
        <p>Description: <span>${jsonData.Plot}</span></p>
     </div>
    `;

    document.querySelector("#preFixedMoviesList").appendChild(div);


    // Click on poster to show full details
    div.addEventListener('click', () => {
      displayMovieDetails(jsonData.Title);
    });
  }
};




// On page load
searchBtn.addEventListener("click", function() {
  let movieName = searchInput.value;
  if (movieName != "") {
    displayMovieSearchResults(movieName); // Use search results with 's'
  } else {
    document.querySelector("#movieCardSection").innerHTML = "<p style='color:red; font-size: 1rem;'>Search a movie name first</p>";
  }
});


// Function to search movies
const displayMovieSearchResults = async (searchTerm) => {
  try {
    // Step 1: Search for movies using the 's' parameter
    let fetchData = await fetch(`https://www.omdbapi.com/?apikey=${APIKey}&s=${searchTerm}`);
    let jsonData = await fetchData.json();

    if (jsonData.Response === "False") {
      document.querySelector("#movieCardSection").innerHTML = "<p style='color:red; font-size: 1rem;'>No results found</p>";
      return;
    }

    // Clear previous search result
    document.querySelector("#movieCardSection").innerHTML = "";

    // Step 2: For each movie, fetch more details using the 't' parameter
    const detailedMoviesPromises = jsonData.Search.map(async (movie) => {
      let detailFetchData = await fetch(`https://www.omdbapi.com/?apikey=${APIKey}&t=${movie.Title}`);
      return detailFetchData.json(); // This will return a detailed movie object
    });

    // Wait for all detailed fetch requests to complete
    const detailedMovies = await Promise.all(detailedMoviesPromises);

    // Step 3: Display movie cards with detailed information
    detailedMovies.forEach(movie => {
      let div = document.createElement("div");
      div.classList.add("movieCard");
      div.innerHTML = `
        <img src="${movie.Poster}" alt="">
        <div class="cardText">
          <h1>${movie.Title}</h1>
	  <p class="rating">Ratings: <span>${movie.Ratings[0]?.Value || 'N/A'}</span></p>
          <a href="#">${movie.Genre}</a>
       	  <p>Release: <span>${movie.Released}</span></p>
 	  <p>Duration: <span>${movie.Runtime}</span></p>
	  <p>Description: <span>${movie.Plot}</span></p>
        </div>
      `;

      // Append movie card to movieCardSection
      document.querySelector("#movieCardSection").appendChild(div);

      // Click on poster to show full details 
      div.addEventListener('click', () => {
        displayMovieDetails(movie.Title); // Pass the exact movie title if you want to fetch detailed view again
      });
    });
  } catch (error) {
    document.querySelector("#movieCardSection").innerHTML = "<h1>Error fetching data</h1>";
    console.error(error); 
  }
};






displayFavorites(); 
displayPreFixedMovies(); 

