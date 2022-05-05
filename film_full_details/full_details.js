let key = "b44b2b9e1045ae57b5c211d94cc010d9"
let genre_page_link = "../genres/genre_result.html"
let pageName = "genre_result"
let filmDetails;
let filmData = JSON.parse(sessionStorage.getItem("filmData"))

let trailerPoster = document.getElementById("film-trailer-poster")
let playLink = document.getElementById("play_link")
let trailer = document.querySelector("iframe")

function loadTrailer(){
	playLink.style.display = "none";
	trailerPoster.style.display = "none"
	filmDetails.videos.results.forEach(video => {
		if (video.name == "Official Trailer") {
			trailer.src = `https://www.youtube.com/embed/${video.key}`
		}
	})
}

let filmName = document.getElementById("film-name")
let film_type = document.getElementById("film-type")
let userRatings = document.getElementById("user-reviews-nd-ratings")
let posterContainer = document.getElementById("small-img")
let synopsis = document.getElementById("synopsis")
let rrr = document.getElementById("rrr")
let certification = rrr.querySelectorAll("div")[0]
let releaseDate = rrr.querySelectorAll("div")[1]
let runTime = rrr.querySelectorAll("div")[2]
let myRating = userRatings.querySelectorAll("h2")[0]
let totalReviews = userRatings.querySelectorAll("h2")[1]
let popularity = userRatings.querySelectorAll("h2")[2]
let filmGenres = document.getElementById("film-genres")

let castWrapper = document.getElementById("casts")
let cast_temp_container = new DocumentFragment()
let cast_container = document.createElement("div")
let cast_img = document.createElement("img")
let cast_name = document.createElement("span")
let cast_role = document.createElement("span")
cast_container.classList.add("cast")
cast_name.classList.add("name")
cast_role.classList.add("role-played")
cast_container.appendChild(cast_img)
cast_container.appendChild(cast_name)
cast_container.appendChild(cast_role)

let dummyContainer = new DocumentFragment()
let film = document.querySelector("template").content.firstElementChild
let similarMoviePoster = film.querySelector("img")
let name = film.querySelector(".similar-film-name")
let similarFilmsList;
let similarFilmsContainer = document.getElementById("similar-films");

if (filmData.filmType == "movie") {
	film_type.textContent = "Movie"
	fetch(`https://api.themoviedb.org/3/movie/${filmData.filmId}?api_key=${key}&language=en-US
		&append_to_response=videos,credits,similar,recommendations`)
	.then(response => response.json())
	.then(response => {
		filmDetails = response; sort();
		window.addEventListener("resize", adjustSynopsisLength);
	})
}else {
	film_type.textContent = "Tv Series"
	fetch(`https://api.themoviedb.org/3/tv/${filmData.filmId}?api_key=${key}&language=en-US
		&append_to_response=videos,credits,similar,recommendations,release_dates`)
	.then(response => response.json())
	.then(response => {
		filmDetails = response; sort();
		window.addEventListener("resize", adjustSynopsisLength);
	})
}

function sort() {
	trailerPoster.src = `https://image.tmdb.org/t/p/w1280${filmDetails.backdrop_path}`
	playLink.addEventListener("click", loadTrailer)

	if (filmData.filmType == "movie") {
		filmName.textContent = filmDetails.title
		releaseDate.textContent = "Release Date: " + filmDetails.release_date
		runTime.textContent = "Run time: " + filmDetails.runtime + " mins"
		similarFilmsList = filmDetails.recommendations;
	}else {
		filmName.textContent = filmDetails.name
		releaseDate.textContent = "First air date: " + filmDetails.first_air_date
		runTime.textContent = "episode Run time: " + filmDetails.episode_run_time + " mins"
		similarFilmsList = filmDetails.similar;
	}
	myRating.textContent = filmDetails.vote_average * 10 + "%"
	totalReviews.textContent = filmDetails.vote_count
	popularity.textContent = Math.round(filmDetails.popularity/100)

	filmDetails.genres.forEach(genre => {
		let div = document.createElement("div")
		div.textContent = genre.name
		filmGenres.appendChild(div)
	})
	adjustSynopsisLength()
	let poster = document.createElement("img")
	poster.src = `https://image.tmdb.org/t/p/w342${filmDetails.poster_path}`
	posterContainer.appendChild(poster)
	let cast = filmDetails.credits.cast
	for (let i=0, c=cast.length; i<c; i++) {
		cast_img.src = `https://image.tmdb.org/t/p/w342${cast[i].profile_path}`
		cast_img.load = "lazy"
		cast_name.textContent = cast[i].name
		if (cast[i].character.length > 15) {
			cast_role.textContent = cast[i].character.slice(0, 13) + ".."
		}else cast_role.textContent = cast[i].character
		cast_temp_container.appendChild(cast_container.cloneNode(true))
		if (i == 16) {
			break
		}
	}
	castWrapper.appendChild(cast_temp_container)
	displaySimilarMovies()
}

function displaySimilarMovies() {
	for (let i=0, s=similarFilmsList.results.length; i<s; i++){
		similarMoviePoster.src = `https://image.tmdb.org/t/p/w300${similarFilmsList.results[i].poster_path}`
		if (similarFilmsList.results[i].hasOwnProperty("release_date")) {
			name.textContent = similarFilmsList.results[i].title
		}else name.textContent = similarFilmsList.results[i].name
		dummyContainer.appendChild(film.cloneNode(true))
	}
	similarFilmsContainer.appendChild(dummyContainer)
}

function adjustSynopsisLength() {
	if (filmDetails.overview.length > 280) {
		if (window.innerWidth > 500) {
			synopsis.innerHTML = "<h2>Synopsis:</h2>" + filmDetails.overview
		}else{
		synopsis.innerHTML = `<h2>Synopsis:</h2>${filmDetails.overview.slice(0, 280)}...<span id="more" style="color: lightblue;">More</span>`
		let moreSynopsis = document.getElementById("more");
		moreSynopsis.addEventListener("click", showAllSynopsis);
		}
	}else {
		synopsis.innerHTML = "<h2>Synopsis:</h2>" + filmDetails.overview
	}
}

function showAllSynopsis() {
	synopsis.innerHTML = "<h2>Synopsis:</h2>" + filmDetails.overview
}