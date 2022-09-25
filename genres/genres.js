let key = "b44b2b9e1045ae57b5c211d94cc010d9"
let genre_page_link = ""
// global variable to be used in genres.js file
let pageName = "genre_result"

let resultsContainer = document.getElementById("genre-results-container")
resultsContainer.innerHTML = ""
// Get data stored in sessionStorage by clicked genres
let data = JSON.parse(sessionStorage.getItem("data")) 
let noResult = document.getElementById('no-result') // Element that displays the text 'No result found'

if (data) {
	getFilmsWith(data.genre_id)
}else {
	noResult.classList.remove('d-none')
}

function getFilmsWith(genre) {
	let tv_genre_id = ""
	let movie_genre_id = ""
	if (data.section != "movies page" && data.section != "tv-series page") {
		// Pages apart from movies page and tv-series page have merged tv and movie genres seperated with a comma
		// So they have to be sepaerated first
		for (let c=0,g=genre.length; c<g; c++) {
			tv_genre_id += genre[c]
			if (genre[c] == ",") {
				movie_genre_id = genre.slice(genre.indexOf(",")+1, g)
				break
			}
		}
		fetchFilmsById(movie_genre_id, "movies page");
		fetchFilmsById(tv_genre_id, "tv-series page");
	}else if (data.section == "movies page") {
		movie_genre_id = genre
		fetchFilmsById(movie_genre_id, "movies page")
	}else {
		tv_genre_id = genre
		fetchFilmsById(tv_genre_id, "tv-series page")
	}
}

function fetchFilmsById(id, requestSection) {
	if (requestSection == "movies page") {
		fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&with_genres=${id}`)
		.then(response => response.json())
		.then(response => displaySearchResults(response, "movie"))
	}
	if (requestSection == "tv-series page") {
		console.log("hbh")
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
name.href = "../film_full_details/full_details.html"
name.className = "result-name"
let releaseDate = document.createElement("div")
show.appendChild(poster)
resultDetails.appendChild(name)
resultDetails.appendChild(mediaType)
resultDetails.appendChild(releaseDate)
show.appendChild(resultDetails)
result.appendChild(show)
let dummyResultContainer = new DocumentFragment()

/** Function that stores film details for full_details page when film link is clicked bcos all this website 
*	can actually do is make requests to an external api (no actual server side). Clicked film details will 
*	be stored in sessionStorage and loaded when full_details page is loaded.
*	@param {string}filmId: id of the clicked movie link, will be used when making request to the api when the page is loaded
*	@param {string}filmType: could be movie or tv series, will also be used when making request to the api when the page is loaded
*/
function storeFilmId(filmId, filmType) {
	let filmData = {"filmId": filmId, "filmType": filmType}
	sessionStorage.setItem("filmData", JSON.stringify(filmData))
}

function displaySearchResults(response, type) {
	for (let i = 0; i < response.results.length; i++) {
		if (type == "tv") {
			name.textContent = response.results[i].name
			releaseDate.textContent = "first-air-date: " + response.results[i].first_air_date
			mediaType.textContent = "Tv-series"
			name.id = response.results[i].id
		}else {
			name.textContent = response.results[i].title
			releaseDate.textContent = "Release date: " + response.results[i].release_date
			mediaType.textContent = "Movie"
			name.id = response.results[i].id
		}
		poster.src = `https://image.tmdb.org/t/p/w342${response.results[i].poster_path}`
		poster.loading = "lazy"
		let resultNode = result.cloneNode(true)
		let resultName = resultNode.querySelector(".result-name")
		resultName.addEventListener("click", () => {storeFilmId(resultName.id, type)})
		dummyResultContainer.appendChild(resultNode)
	}
	resultsContainer.appendChild(dummyResultContainer)
}
