let key = "b44b2b9e1045ae57b5c211d94cc010d9"

let form = document.getElementById("search-bar-container")
let input = form.querySelector("input")
form.addEventListener("submit", (e)=>{e.preventDefault(); search(input.value)})

let resultsContainer = document.getElementById("search-results-container")
function search(string) {
	resultsContainer.innerHTML = ""
	fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&page=1&query=${string}`)
	.then(response => response.json())
	.then(response => displaySearchResults(response, "Movie"))

	fetch(`https://api.themoviedb.org/3/search/tv?api_key=${key}&language=en-US&page=1&query=${string}`)
	.then(response => response.json())
	.then(response => displaySearchResults(response, "Tv-series"))
}

let result = new DocumentFragment()
let show = document.createElement("div")
show.className = "search-result"
let resultDetails = document.createElement("div")
resultDetails.className = "result-details"
let mediaType = document.createElement("div")
mediaType.className = "media-type"
let poster = document.createElement("img")
let nameLink = document.createElement("a")
let name = document.createElement("h2")
name.className = "result-name"
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
