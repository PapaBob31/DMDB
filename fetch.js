let menuIcon = document.getElementById("mobile-menu")
let menuBar = document.getElementById("menu-bar")
let closeMenu = document.getElementById("close-menu")

menuIcon.addEventListener("click", showMenu)
closeMenu.addEventListener("click", hideMenu)

let menuOnscreen = false

function showMenu() {
	if (!menuOnscreen) {
		menuBar.style.left = "0"
		menuOnscreen = true
	}
}

function hideMenu() {
	if (menuOnscreen) {
		menuBar.style.left = `-${menuBar.offsetWidth+10}px`
		menuOnscreen = false
	}
}

let genresLink = document.getElementById("genres-link")
let genresContainer = document.getElementById("genres")

function showGenres() {
	genresContainer.style.left = '0'
}

function hideGenres() {
	genresContainer.style.left = '-100%'
}

genresLink.addEventListener("click", showGenres)

let backArrow = document.getElementById("back-arrow")
backArrow.addEventListener("click", hideGenres)

let vel = 0
let navLeft = document.getElementById("move-left")
let navRight = document.getElementById("move-right")
let bottomStatus = document.getElementById("bottom-status")
let status = bottomStatus.querySelectorAll("div")
status = Array.from(status)
statusIndex = 0

function moveImagesLeft() {
	if (vel != -200) {
		vel -= 100
		for (let i=0; i<trendingMovies.length; i++) {
			trendingMovies[i].style.transform = `translateX(${vel}%)`
		}
		status[statusIndex].removeAttribute("id")
		statusIndex += 1
		status[statusIndex].id = "current"
	}
}

function moveImagesRight() {
	if (vel != 0) {
		vel += 100
		for (let i=0; i<trendingMovies.length; i++) {
			trendingMovies[i].style.transform = `translateX(${vel}%)`
		}
		status[statusIndex].removeAttribute("id")
		statusIndex -= 1
		status[statusIndex].id = "current"
	}
}

navLeft.addEventListener("click", moveImagesLeft)
navRight.addEventListener("click", moveImagesRight)

let trendingMoviesContainer = document.getElementById("trending-movies-container")
let trendingMovies = document.querySelectorAll("#trending-movie")
trendingMovies = Array.from(trendingMovies)
let media = []
let trendingMoviesDetails = []
let key = "b44b2b9e1045ae57b5c211d94cc010d9"

function getTrendingMovies(list) {
	let index = 0;
	let releaseDate = undefined
	for (let i = 0; i < list.length; i++) {
		let medium = {}
		if (index < (trendingMovies.length)) {
			if (list[i].vote_average >= 7.9) {
				if (list[i].hasOwnProperty("first_air_date")) {
					releaseDate = list[i].first_air_date
					medium.type = "tv"
				}else {
					releaseDate = list[i].release_date
					medium.type = "movie"
				}
				releaseMonth = releaseDate.slice(5, 7)
				date = new Date()
				if (date.getMonth() + 1 == parseInt(releaseMonth) || parseInt(releaseMonth) == date.getMonth()) {
					index += 1
					medium.id = list[i].id
					media.push(medium)
				}
			}
		}else {break}
	}
}

function getTrendingMoviesDetails(mediaList) {
	let movieNo = 0
	for (let i=0; i<mediaList.length; i++) {
		fetch(`https://api.themoviedb.org/3/${mediaList[i].type}/${mediaList[i].id}?api_key=${key}&language=en-US&append_to_response=videos,release_dates`)
		.then(response => response.json())
		.then(response => {trendingMoviesDetails.push(response); updateTrendingMovies(trendingMoviesDetails, movieNo); movieNo += 1})
	}
}

function updateTrendingMovies(details, i) {
	mediaName = trendingMovies[i].querySelector("#media-name")
	poster  = trendingMovies[i].querySelector("img")
	genres = trendingMovies[i].querySelector("#trending-genres")
	trailer = trendingMovies[i].querySelector("iframe")
	overview = trendingMovies[i].querySelector("#overview")
	releaseDateandType = trendingMovies[i].querySelector("#media-type-nd-release-date")
	releaseDate = document.createElement("div")
	mediaType = document.createElement("div")
	poster.src = `https://image.tmdb.org/t/p/w1280${details[i].backdrop_path}`
	if (details[i].original_name) {
		mediaName.textContent = details[i].original_name
		releaseDate.textContent = `first episode date: ${details[i].first_air_date}`
		mediaType.textContent = "Tv Series"
		releaseDateandType.appendChild(releaseDate)
		releaseDateandType.appendChild(mediaType)
	}else {
		mediaName.textContent = details[i].original_title
		releaseDate.textContent = `first episode date: ${details[i].release_date}`
		mediaType.textContent = "Movie"
		releaseDateandType.appendChild(releaseDate)
		releaseDateandType.appendChild(mediaType)
	}
	for (let v = 0; v < details[i].videos.results.length; v++) {
		if (details[i].videos.results[v].name == "Official Trailer") {
			trailer.src=`https://www.youtube.com/embed/${details[i].videos.results[v].key}`
			break
		}
	}

	for (let n=0; n<details[i].genres.length; n++) {
		genre = document.createElement("div")
		genre.textContent = details[i].genres[n].name
		genres.appendChild(genre)
	}
	overview.textContent = trimText(details[i].overview)
}

function trimText(text) {
	if (text.length > 200) {
		text = text.slice(0, 200)
		return text
	}
}

fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${key}`)
.then(response => response.json())
.then(response => {storeResult("trending", response); getTrendingMovies(response.results); getTrendingMoviesDetails(media)})

let sectionNamesContainer = document.getElementById("section-names")
let sectionNames = Array.from(sectionNamesContainer.querySelectorAll("div"))
let sections = document.querySelectorAll('.sections')
sections = Array.from(sections)
let mostPopular = []

for(let i=0; i<sectionNames.length; i++) {
	sectionNames[i].addEventListener("click", changeSection)
}

function changeSection() {
	let clickedSection = this
	let currentSection = document.getElementById("current-section")
	if (clickedSection != currentSection) {
		currentSection.removeAttribute('id', 'current-section')
		clickedSection.setAttribute('id', 'current-section')
	}
	let newIndex = sectionNames.indexOf(clickedSection)
	let oldIndex = sectionNames.indexOf(currentSection)
	sections[oldIndex].style.display = 'none'
	if (newIndex != 0) {
		sections[newIndex].style.display = 'flex'
	}else {
		sections[newIndex].style.display = 'block'
	}
}

closeBtn = document.getElementById("close-btn")
clickedMovieDetails = document.getElementById("clicked-movie-details")
movies = document.querySelectorAll(".movie-container")

function showFullDetails() {
	clickedMovieDetails.style.right = "10px"
}

function closeFullDetails() {
	clickedMovieDetails.style.right = "-24%"
}

for (let i=0; i<movies.length; i++) {
	movies[i].addEventListener("click", showFullDetails)
}

closeBtn.addEventListener("click", closeFullDetails)

topPicks = document.getElementById("top-picks")

let movieGenres = [] 
let tvGenres = []

function storeResult(data_name, data) {
	sessionStorage.setItem(data_name, JSON.stringify(data))
}

fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {movieGenres=res; storeResult("movieGenres", movieGenres); fetchMovies()})

fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {tvGenres=res; storeResult("seriesGenres", tvGenres); fetchTvSeries()})

function fetchMovies() {
	fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&page=1`)
	.then(res => res.json())
	.then(res => {displayResponse(res, "movie", "top-movies"); storeResult("top-movies", res.results)})

	fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=1&region=US`)
	.then(res => res.json())
	.then(res => {displayResponse(res, "movie", "recent-releases"); storeResult("recent-movies", res.results)})

	fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=1&region=US`)
	.then(res => res.json())
	.then(res => {displayResponse(res, "movie", "coming-soon"); storeResult("upcoming-movies", res.results)})
}

function fetchTvSeries() {
	fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${key}&page=1`)
	.then(res => res.json())
	.then(res => {displayResponse(res, "tv", "top-series"); storeResult("top-tv", res.results)})

	fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${key}&language=en-US&page=1&region=US`)
	.then(res => res.json())
	.then(res => {displayResponse(res, "tv", "recent-releases"); storeResult("recent-series", res.results)})

}

function displayResponse(response, responseType, parentId) {
	for (let i = 0; i < response.results.length; i++) {
		film = response.results[i]
		let mediaContainer = document.createElement("div")
		let poster = document.createElement("img")
		let name = document.createElement("div")
		let littleDetails = document.createElement("div")
		let releaseYear = document.createElement("span")
		let mediaGenres = document.createElement("div")
		let genresList = []
		mediaContainer.className = "media-container"
		name.id = "name"
		littleDetails.id = "little-details"
		poster.src = poster.src = `https://image.tmdb.org/t/p/w342${film.poster_path}`
		if (responseType == "movie") {
			name.textContent = film.title
			genresList = movieGenres.genres
			releaseYear.textContent = film.release_date.slice(0, 4)
		}else if (responseType == "tv") {
			name.textContent = film.name
			genresList = tvGenres.genres
			releaseYear.textContent = "Since " +  film.first_air_date.slice(0, 4)
		}
		mediaGenres.textContent = " | "
		for (let n=0; n < film.genre_ids.length; n++) {
			for (let e=0; e < genresList.length; e++) {
				if (film.genre_ids[n] == genresList[e].id) {
					if (film.genre_ids[n] != film.genre_ids[film.genre_ids.length-1]) {
						mediaGenres.textContent += genresList[e].name + ', '
						break
					}else {
						mediaGenres.textContent += genresList[e].name
						break
					}
				}
			} 
		}
		let parentContainer = document.getElementById(parentId)
		littleDetails.appendChild(releaseYear)
		littleDetails.appendChild(mediaGenres)
		mediaContainer.appendChild(poster)
		mediaContainer.appendChild(name)
		mediaContainer.appendChild(littleDetails)
		parentContainer.appendChild(mediaContainer)
	}
}