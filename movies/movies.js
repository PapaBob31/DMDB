let key = "b44b2b9e1045ae57b5c211d94cc010d9"
let moviesContainer = document.getElementById("movies-container")
let genresList = []

loadData()
function storeResult(data_name, data) {
	sessionStorage.setItem(data_name, JSON.stringify(data))
}

function loadData() {
	if (sessionStorage.getItem("top-movies") != undefined) {
		moviesList = JSON.parse(sessionStorage.getItem("top-movies"))
		if (sessionStorage.getItem("movieGenres") != undefined) {
			genresList = JSON.parse(sessionStorage.getItem("movieGenres")).genres
			displayMovies(moviesList)
		}else {
		fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`)
		.then(response => response.json())
		.then(response => {genresList=response.genres; storeResult("movieGenres", genresList); displayMovies(moviesList)})
		}
	}else {
		fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&page=1`)
		.then(res => res.json())
		.then(res => {storeResult("top-movies", res.results); loadData()})
	}
}

function skeletonLoader(parentId, templateChild, no) {
	let parentContainer = document.getElementById(parentId)
	for (let i=0; i<no; i++) {
		let skeleton = document.querySelector("template").content[templateChild].cloneNode(true)
		parentContainer.appendChild(skeleton)
	}
}
skeletonLoader("movies-container", "firstElementChild", 40)


function displayMovies(moviesList) {
	for (let i=0; i<moviesList.length; i++) {
		let movie = document.createElement("div")
		let poster = document.createElement("img")
		let name = document.createElement("div")
		let littleDetails = document.createElement("div")
		let releaseYear = document.createElement("span")
		let mediaGenres = document.createElement("div")
		movie.className = "media-container"
		poster.src = `https://image.tmdb.org/t/p/w342${moviesList[i].poster_path}`
		name.id = "name"
		littleDetails.id = "little-details"
		mediaGenres.textContent = " | "
		createGenres(moviesList[i], mediaGenres)
		name.textContent = moviesList[i].title
		releaseYear.textContent = moviesList[i].release_date.slice(0, 4)
		console.log(releaseYear)
		littleDetails.appendChild(releaseYear)
		littleDetails.appendChild(mediaGenres)
		movie.appendChild(poster)
		movie.appendChild(name)
		movie.appendChild(littleDetails)
		moviesContainer.append(movie)
	}
}

function createGenres(movie, genresContainer) {
	for (let n=0; n < movie.genre_ids.length; n++) {
		for (let e=0; e < genresList.length; e++) {
			if (movie.genre_ids[n] == genresList[e].id) {
				if (movie.genre_ids[n] != movie.genre_ids[movie.genre_ids.length-1]) {
					genresContainer.textContent += genresList[e].name + ', '
					break
				}else {
					genresContainer.textContent += genresList[e].name
					break
				}
			}
		} 
	}
}