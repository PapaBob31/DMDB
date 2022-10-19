let key = "b44b2b9e1045ae57b5c211d94cc010d9"
let genre_page_link = ""
// global variable to be used in genres.js file
let pageName = "all"

let resultsContainer = document.getElementById("genre-results-container")
// Get data stored in sessionStorage by clicked genres
let noResult = document.getElementById('no-result') // Element that displays the text 'No result found'
let data = get_genre_data()

getFilmsWith(data.id)

function get_genre_data() {
	let genre_data = {section: "", id: ""}
	let url_params = new URLSearchParams(window.location.search)
	genre_data.id = url_params.get("id")
	genre_data.section = url_params.get("section")
	if (!genre_data.section || !genre_data.id){
		noResult.classList.remove('d-none')
		throw "Invalid request!"
	}
	return genre_data
}

function getFilmsWith(genre) {
	let tv_genre_id = ""
	let movie_genre_id = ""
	if (data.section != "movies" && data.section != "tv-series") {
		// Pages apart from movies and tv-series have merged tv and movie genres seperated with a comma
		// So they have to be sepaerated first
		genre = genre.split(",")
		tv_genre_id = genre[0]
		movie_genre_id = genre[1]
		fetchFilmsById(movie_genre_id, "movies");
		fetchFilmsById(tv_genre_id, "tv-series");
	}else if (data.section == "movies") {
		movie_genre_id = genre
		fetchFilmsById(movie_genre_id, "movies")
	}else {
		tv_genre_id = genre
		fetchFilmsById(tv_genre_id, "tv-series")
	}
}

function fetchFilmsById(id, requestSection) {
	if (requestSection == "movies") {
		fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&with_genres=${id}`)
		.then(response => response.json())
		.then(response => displaySearchResults(response, "movie"))
	}
	if (requestSection == "tv-series") {
		fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${key}&language=en-US&with_genres=${id}`)
		.then(response => response.json())
		.then(response => displaySearchResults(response, "tv"))
	}
}

let result = new DocumentFragment()
let show = document.createElement("div")
show.className = "genre-result"
let resultDetails = document.createElement("div")
resultDetails.className = "result-details"
let mediaType = document.createElement("div")
mediaType.className = "media-type"
let poster = document.createElement("img")
let name = document.createElement("a")
name.className = "result-name"
let releaseDate = document.createElement("div")
show.appendChild(poster)
resultDetails.appendChild(name)
resultDetails.appendChild(mediaType)
resultDetails.appendChild(releaseDate)
show.appendChild(resultDetails)
result.appendChild(show)
let dummyResultContainer = new DocumentFragment()


function displaySearchResults(response, type) {
	for (let i = 0; i < response.results.length; i++) {
		if (type == "tv") {
			name.textContent = response.results[i].name
			releaseDate.textContent = "first-air-date: " + response.results[i].first_air_date
			mediaType.textContent = "Tv-series"
			name.href = `../film_full_details/full_details.html?id=${response.results[i].id}&type=tv`
		}else {
			name.textContent = response.results[i].title
			releaseDate.textContent = "Release date: " + response.results[i].release_date
			mediaType.textContent = "Movie"
			name.href = `../film_full_details/full_details.html?id=${response.results[i].id}&type=movie`
		}
		poster.src = `https://image.tmdb.org/t/p/w342${response.results[i].poster_path}`
		poster.loading = "lazy"
		let resultNode = result.cloneNode(true)
		let resultName = resultNode.querySelector(".result-name")
		dummyResultContainer.appendChild(resultNode)
	}
	resultsContainer.appendChild(dummyResultContainer)
}
