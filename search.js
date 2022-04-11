let key = "b44b2b9e1045ae57b5c211d94cc010d9"

let form = document.getElementById("search-bar-container")
let input = form.querySelector("input")
form.addEventListener("submit", search(input.value))

function search(string) {
	fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&page=1&query=${string}`)
	.then(response => response.json())
	.then(response => displaySearchResults(response, "Movie"))

	fetch(`https://api.themoviedb.org/3/search/tv?api_key=${key}&language=en-US&page=1&query=${string}`)
	.then(response => response.json())
	.then(response => displaySearchResults(response, "Tv-series"))
}

function displaySearchResults(response, type) {
	for (let i = 0; i < response.results.length; i++) {
		let resultsContainer = document.getElementById("search-results-container")
		let show = document.createElement("div")
		let resultDetails = document.createElement("div")
		let name = document.createElement("h2")
		let mediaType = document.createElement("div")
		let poster = document.createElement("img")
		let nameLink = document.createElement("a")
		let releaseDate = document.createElement("div")
		if (type == "Tv-series") {
			name.textContent = response.results[i].name
			releaseDate.textContent = "first-air-date: " + response.results[i].first_air_date
			mediaType.textContent = type
		}else {
			name.textContent = response.results[i].title
			releaseDate.textContent = "Release date: " + response.results[i].release_date
			mediaType.textContent = type
		}
		show.className = "search-results"
		name.className = "result-name"
		resultDetails.className = "details"
		mediaType.className = "media-type"
		poster.src = `https://image.tmdb.org/t/p/w342${response.results[i].poster_path}`
		nameLink.href = "#"
		nameLink.appendChild(name)
		resultDetails.appendChild(nameLink)
		resultDetails.appendChild(mediaType)
		resultDetails.appendChild(releaseDate)
		show.appendChild(poster)
		show.appendChild(resultDetails)
		resultsContainer.appendChild(show)
	}
}
