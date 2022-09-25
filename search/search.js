let key = "b44b2b9e1045ae57b5c211d94cc010d9"
let genre_page_link = "../genres/genre_result.html"
// global variable to be used in genres.js file
let pageName = "search page"
let resultsContainer = document.getElementById("search-results-container")

function search(string) {
	resultsContainer.innerHTML = ""
	fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&page=1&query=${string}`)
	.then(response => response.json())
	.then(response => displaySearchResults(response, "movie"))

	fetch(`https://api.themoviedb.org/3/search/tv?api_key=${key}&language=en-US&page=1&query=${string}`)
	.then(response => response.json())
	.then(response => displaySearchResults(response, "tv"))
}

let noResult = document.getElementById('no-result') // Element that displays the text 'No result found'
let query = sessionStorage.getItem("query")
if (query) {
	search(sessionStorage.getItem("query"))
}else {
	noResult.classList.remove('d-none')
}

let result = new DocumentFragment()
let show = document.createElement("div")
show.className = "search-result"
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
