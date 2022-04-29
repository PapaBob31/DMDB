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
	.then(response => displaySearchResults(response, "Movie"))

	fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${key}&language=en-US&with_genres=${tv_genre_id}`)
	.then(response => response.json())
	.then(response => displaySearchResults(response, "Tv-series"))
}

let result = new DocumentFragment()
let show = document.createElement("div")
show.className = "genre-result"
let resultDetails = document.createElement("div")
resultDetails.className = "genre-details"
let mediaType = document.createElement("div")
mediaType.className = "media-type"
let poster = document.createElement("img")
let nameLink = document.createElement("a")
let name = document.createElement("h2")
name.className = "genre-name"
let releaseDate = document.createElement("div")
nameLink.appendChild(name)
show.appendChild(poster)
resultDetails.appendChild(nameLink)
resultDetails.appendChild(mediaType)
resultDetails.appendChild(releaseDate)
show.appendChild(resultDetails)
result.appendChild(show)

function displaySearchResults(response, type) {
	for (let i = 0; i < response.results.length; i++) {
		if (type == "Tv-series") {
			name.textContent = response.results[i].name
			releaseDate.textContent = "first-air-date: " + response.results[i].first_air_date
			mediaType.textContent = type
		}else {
			name.textContent = response.results[i].title
			releaseDate.textContent = "Release date: " + response.results[i].release_date
			mediaType.textContent = type
		}
		poster.src = `https://image.tmdb.org/t/p/w342${response.results[i].poster_path}`
		resultsContainer.appendChild(result.cloneNode(true))
	}
}
