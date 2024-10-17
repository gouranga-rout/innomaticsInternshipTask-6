let APIKey = "ec958024";
let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchBtn");
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let ratingsReviews = JSON.parse(localStorage.getItem('ratingsReviews')) || {};

// Function to fetch and display movie data in the searched section
const displayMovieDetails = async (movie) => {
  try {
    let fetchData = await fetch(`https://www.omdbapi.com/?apikey=${APIKey}&t=${movie}`);
    let jsonData = await fetchData.json();

    if (jsonData.Response === "False") {
      document.querySelector("#movieCardSection").innerHTML = "<p style='color:red; font-size: 1rem;'>Enter a valid movie name</p>";
      return;
    }

    // Clear previous search result
    document.querySelector("#movieCardSection").innerHTML = "";
    searchInput.value = "";

    // Create movie card with full details
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
	<button class="addToFavBtn">Add to Favorites</button>
        <p>Rating this movie : <input type="number" id="ratingInput" placeholder="1-10" min="1" max="10" value="${ratingsReviews[jsonData.imdbID]?.rating || ''}"></p>
        <p>Your Feedback : <input type="text" id="reviewInput" placeholder="Write a review" value="${ratingsReviews[jsonData.imdbID]?.review || ''}"></p>
        <button class="saveReviewBtn">Save Rating & Review</button>
      </div>
    `;

    // Check if movie is already in favorites
    if (favorites.find(fav => fav.imdbID === jsonData.imdbID)) {
      div.querySelector('.addToFavBtn').innerText = "Remove from Favorites";
      div.querySelector('.addToFavBtn').classList.add('in-favorites');
    }

    // Append movie card to movieCardSection
    document.querySelector("#movieCardSection").appendChild(div);

    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'  // Smooth scroll effect
    });

    // Add functionality to save rating and review
    div.querySelector('.saveReviewBtn').addEventListener('click', () => {
      let rating = div.querySelector('#ratingInput').value;
      let review = div.querySelector('#reviewInput').value;

      ratingsReviews[jsonData.imdbID] = { rating, review };
      localStorage.setItem('ratingsReviews', JSON.stringify(ratingsReviews));
      alert('Rating and review saved!');
    });

    // Add to Favorites button functionality
    div.querySelector('.addToFavBtn').addEventListener('click', function() {
      if (favorites.find(fav => fav.imdbID === jsonData.imdbID)) {
        removeFromFavorites(jsonData);
        div.querySelector('.addToFavBtn').innerText = "Add to Favorites";
        div.querySelector('.addToFavBtn').classList.remove('in-favorites');
      } else {
        addToFavorites(jsonData);
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
     
      <img src=${movie.Poster} alt="">
      <div class="cardText">
        <h1>${movie.Title}</h1>
        <p class="rating">Ratings: <span>${movie.Ratings[0]?.Value || 'N/A'} </span></p>
        <a href="#">${movie.Genre}</a>
        <p>Release: <span>${movie.Released}</span></p>
        <p>Duration: <span>${movie.Runtime}</span></p>
        <p>Description: <span>${movie.Plot}</span></p>
        <button class="removeFromFavBtn">Remove from Favorites</button>
      </div>
    `;
    favoritesList.appendChild(div);





    // Click on poster to show full details
    div.addEventListener('click', () => {
      displayMovieDetails(movie.Title);
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
    displayMovieDetails(movieName);
  } else {
    document.querySelector("#movieCardSection").innerHTML = "<p style='color:red; font-size: 1rem;'>Search a movie name first</p>";
  }
});

displayFavorites();  // Show favorites on load
displayPreFixedMovies();  // Show pre-fixed movies on load


