let key = "b44b2b9e1045ae57b5c211d94cc010d9"
let genre_page_link = ""
let pageName = "genre_result"

let resultsContainer = document.getElementById("genre-results-container")
resultsContainer.innerHTML = ""
let data = JSON.parse(sessionStorage.getItem("data"))
genreDetails = data.genre_id
get(genreDetails)
function get(genre) {
	let tv_genre_id = ""
	let movie_genre_id = ""
	if (genreDetails.section != "movies page" && genreDetails.section != "tv-series page") {
		for (let c=0,g=genreDetails.length; c<g; c++) {
			tv_genre_id += genreDetails[c]
			if (genreDetails[c] == ",") {
				movie_genre_id = genreDetails.slice(genreDetails.indexOf(",")+1, g)
				break
			}
		}
	}
	fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&with_genres=${movie_genre_id}`)
	.then(response => response.json())
	.then(response => displaySearchResults(response, "movie"))

	fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${key}&language=en-US&with_genres=${tv_genre_id}`)
	.then(response => response.json())
	.then(response => displaySearchResults(response, "tv"))
}

let result = new DocumentFragment()
let show = document.createElement("div")
show.className = "genre-result"
let resultDetails = document.createElement("div")
resultDetails.className = "result-details"
let mediaType = document.createElement("div")
mediaType.className = "media-type"
let poster = document.createElement("img")
poster.loading = "lazy"
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
		let resultNode = result.cloneNode(true)
		let resultName = resultNode.querySelector(".result-name")
		resultName.addEventListener("click", () => {storeFilmId(resultName.id, type)})
		dummyResultContainer.appendChild(resultNode)
	}
	resultsContainer.appendChild(dummyResultContainer)
}
