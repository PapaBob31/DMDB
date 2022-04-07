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
		menuBar.style.left = "-100%"
		menuOnscreen = false
	}
}

let genresLink = document.getElementById("genres-link")
let genresContainer = document.getElementById("genres")
let genres = genresContainer.querySelector("div")

function showGenres() {
	genresContainer.style.left = '0'
	genres.style.transform = 'scaleY(100%)'
}

function hideGenres() {
	genres.style.transform = 'scaleY(0)'
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
	console.log(details[i])
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
	.then(response => {getTrendingMovies(response.results); getTrendingMoviesDetails(media)})

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

movieGenres = [] 
tvGenres = []

// fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`)
// .then(res => res.json())
// .then(res => {movieGenres=res; console.log(movieGenres)})

// fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${key}&language=en-US`)
// .then(res => res.json())
// .then(res => {tvGenres=res; console.log(tvGenres)})

// fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&page=1`)
// .then(res => res.json())
// .then(res => displayResponse(res, "movie", "top-movies"))

// fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${key}&page=1`)
// .then(res => res.json())
// .then(res => displayResponse(res, "tv", "top-tv"))

// // fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=1&region=US`)
// // .then(res => res.json())
// // .then(res => console.log(res))

// fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=1&region=US`)
// .then(res => res.json())
// .then(res => displayResponse(res, "movie", "recent-releases"))

// fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${key}&language=en-US&page=1&region=US`)
// .then(res => res.json())
// .then(res => displayResponse(res, "tv", "recent-releases"))

// fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=1&region=US`)
// .then(res => res.json())
// .then(res => displayResponse(res, "movie", "coming-soon"))

function displayResponse(response, responseType, parentId) {
	for (let i = 0; i < response.results.length; i++) {
		let mediaContainer = document.createElement("div")
		let poster = document.createElement("img")
		let name = document.createElement("div")
		let littleDetails = document.createElement("div")
		let releaseYear = document.createElement("span")
		let genresList = []
		let mediaGenres = " | "
		mediaContainer.className = "media-container"
		name.id = "name"
		littleDetails.id = "little-details"
		poster.src = poster.src = `https://image.tmdb.org/t/p/w500${response.results[i].poster_path}`
		if (responseType == "movie") {
			name.textContent = response.results[i].title
			genresList = movieGenres.genres
			releaseYear.textContent = response.results[i].release_date.slice(0, 4)
		}else if (responseType == "tv") {
			name.textContent = response.results[i].name
			genresList = tvGenres.genres
			releaseYear.textContent = response.results[i].first_air_date.slice(0, 4)
		}
		for (let n=0; n < response.results[i].genre_ids.length; n++) {
			for (let e=0; e < genresList.length; e++) {
				if (response.results[i].genre_ids[n] == genresList[e].id) {
					if (response.results[i].genre_ids[n] != response.results[i].genre_ids[-1]) {
						mediaGenres += genresList[e].name + ', '
						break
					}else {
						mediaGenres += genresList[e].name
						break
					}
				}
			} 
		}
		let parentContainer = document.getElementById(parentId)
		let genres = document.createTextNode(mediaGenres)
		littleDetails.appendChild(releaseYear)
		littleDetails.appendChild(genres)
		mediaContainer.appendChild(poster)
		mediaContainer.appendChild(name)
		mediaContainer.appendChild(littleDetails)
		parentContainer.appendChild(mediaContainer)
	}
}


// https://api.themoviedb.org/3/tv/{tv_id}?api_key=${key}&language=en-US130392


//search-syntax: https://api.themoviedb.org/3/search/movie?api_key=${key}&query=deadpool&page=1
//img-syntax: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg'

// 41:
// iso_3166_1: "US"
// release_dates: Array(3)
// 0: {certification: 'PG', iso_639_1: '', note: '', release_date: '2013-03-22T00:00:00.000Z', type: 3}
// 1: {certification: 'PG', iso_639_1: '', note: 'DVD, Blu-ray', release_date: '2013-10-01T00:00:00.000Z', type: 5}
// 2: {certification: 'PG', iso_639_1: '', note: '4K UHD', release_date: '2020-11-17T00:00:00.000Z', type: 5}



// <div id="clicked-movie-details">
// 		<span id="close-btn">close</span>
// 		<img src="shoe 2.jpg">
// 		<div id="clicked-movie-txt">
// 			<div id="name-nd-genres">
// 				<h2>Tired Shoe</h2>
// 				<span>Sport</span>
// 				<span>Adventure</span>
// 				<span>Calories</span>
// 			</div>
// 			<div>Run-Time: </div>
// 			<div>Release Date: </div>
// 			<div id="clicked-movie-ratings">
// 				<div>
// 					<h2>90%</h2>
// 					Rotten Tomatoes
// 				</div>
// 				<div>
// 					<h2>8.1</h2>
// 					IMDB
// 				</div>
// 			</div>
// 			<div id="plot">
// 				<h3>Plot :</h3>
// 				Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
// 				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
// 				quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
// 				consequat.
// 			</div>
// 			<a href="#" id="trailer-link">Watch Trailer</a>
// 		</div>
// 	</div>


// fetch('https://data-imdb1.p.rapidapi.com/titles/search/keyword/deadpool', {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Host': 'data-imdb1.p.rapidapi.com',
//     	'X-RapidAPI-Key': '2d39e8dc5dmshb63147aa42b6c97p127e1bjsnf94f3a9f0c41'
// 	}
// })
// 	.then(res => res.json())
// 	.then(res => console.log(res))