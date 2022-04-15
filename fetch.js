let menuIcon = document.getElementById("mobile-menu")
let menuBar = document.getElementById("menu-bar")
let closeMenu = document.getElementById("close-menu")
let menuOnscreen = false
menuIcon.addEventListener("click", showMenu)
closeMenu.addEventListener("click", hideMenu)

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

let genresContainer = document.getElementById("genres")
let genresLink = document.getElementById("genres-link")
genresLink.addEventListener("click", showGenres)
let backArrow = document.getElementById("back-arrow")
backArrow.addEventListener("click", hideGenres)

function showGenres() {
	genresContainer.style.left = '0'
}

function hideGenres() {
	genresContainer.style.left = '-100%'
}

function skeletonLoader(parentId, templateChild, no) {
	let parentContainer = document.getElementById(parentId)
	for (let i=0; i<no; i++) {
		let skeleton = document.querySelector("template").content[templateChild].cloneNode(true)
		parentContainer.appendChild(skeleton)
	}
}

skeletonLoader("top-movies", "firstElementChild", 20)
skeletonLoader("top-series", "firstElementChild", 20)
skeletonLoader("upcoming", "firstElementChild", 20)
skeletonLoader("recent-shows", "firstElementChild", 40)
skeletonLoader("trending-movies-container", "lastElementChild", 3)

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
let trendingMovies = document.querySelectorAll(".trending-movie")
let media = []
let trendingMoviesDetails = []
let key = "b44b2b9e1045ae57b5c211d94cc010d9"

function getTrendingMovies(list) {
	let index = 0;
	let releaseDate = undefined
	for (let i = 0; i < list.length; i++) {
		let medium = {}
		if (index < (trendingMovies.length)) {
			if (list[i].vote_average >= 7.8) {
				if (list[i].hasOwnProperty("first_air_date")) {
					releaseDate = list[i].first_air_date
					medium.type = "tv"
				}else {
					releaseDate = list[i].release_date
					medium.type = "movie"
				}
				releaseYear = releaseDate.slice(0, 4)
				releaseMonth = releaseDate.slice(5, 7)
				date = new Date()
				if (date.getFullYear() == releaseYear) {
					if (date.getMonth() + 1 == parseInt(releaseMonth) || parseInt(releaseMonth) == date.getMonth()) {
						index += 1
						medium.id = list[i].id
						media.push(medium)
					}
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
	posterLink = `https://image.tmdb.org/t/p/w1280${details[i].backdrop_path}`
	trendingMovies[i].style.backgroundImage = `url('${posterLink}')`
	mediaName = trendingMovies[i].querySelector(".media-name")
	genres = trendingMovies[i].querySelector(".trending-genres")
	trailer = trendingMovies[i].querySelector("iframe")
	overview = trendingMovies[i].querySelector(".overview")
	releaseDateandType = trendingMovies[i].querySelector(".media-type-nd-release-date")
	releaseDate = document.createElement("div")
	mediaType = document.createElement("div")
	if (details[i].original_name) {
		mediaName.textContent = details[i].name
		releaseDate.textContent = `first episode date: ${details[i].first_air_date}`
		mediaType.textContent = "Tv Series"
		releaseDateandType.appendChild(releaseDate)
		releaseDateandType.appendChild(mediaType)
	}else {
		mediaName.textContent = details[i].title
		releaseDate.textContent = `Release date: ${details[i].release_date}`
		mediaType.textContent = "Movie"
		releaseDateandType.appendChild(releaseDate)
		releaseDateandType.appendChild(mediaType)
	}
	for (let v = 0; v < details[i].videos.results.length; v++) {
		if (details[i].videos.results[v].name == "Official Trailer" || details[i].videos.results[v].name == "Main Trailer") {
			trailer.src=`https://www.youtube.com/embed/${details[i].videos.results[v].key}`
			break
		}
	}
	genres.innerHTML = ""
	for (let n=0; n<details[i].genres.length; n++) {
		genre = document.createElement("div")
		genre.textContent = details[i].genres[n].name
		genres.appendChild(genre)
	}
	overview.innerHTML = ""
	overview.textContent = trimText(details[i].overview)
	trendingMovies[i].classList.remove("trending-movie-skeleton")
}

function trimText(text) {
	if (text.length > 200) {
		text = text.slice(0, 200)
		return text
	}else return text
}

// fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${key}`)
// .then(response => response.json())
// .then(response => {storeResult("trending", response); getTrendingMovies(response.results); getTrendingMoviesDetails(media)})

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

let movieGenres = [] 
let tvGenres = []
let practice = []
let recentShows = [{currentIndex: 1, type: "movie", targetContainerId: "recent-shows"}]
let topMovies = [{currentIndex: 1, type: "movie", targetContainerId: "top-movies"}]
let topTv = [{currentIndex: 1, type: "tv", targetContainerId: "top-series"}]
let upcomingMovies = [{currentIndex: 1, type: "movie", targetContainerId: "upcoming"}]

function storeResult(data_name, data) {
	sessionStorage.setItem(data_name, JSON.stringify(data))
}

fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {movieGenres=res; storeResult("movieGenres", movieGenres); fetchMovies(); fetchRecentShows()})

fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {tvGenres=res; storeResult("seriesGenres", tvGenres); fetchTvSeries(); fetchRecentShows()})


function fetchMovies() {
	fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&page=1`)
	.then(res => res.json())
	.then(res => {res.results.forEach(result => topMovies.push(result)); storeResult("top-movies", topMovies); observeChildren("top-movies")})

	fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=1&region=US`)
	.then(res => res.json())
	.then(res => {res.results.forEach(result => upcomingMovies.push(result)); storeResult("upcoming-movies", upcomingMovies); observeChildren("upcoming")})
}
// displayResponse(res, "movie", "top-movies")
function fetchTvSeries() {
	fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${key}&page=1`)
	.then(res => res.json())
	.then(res => {res.results.forEach(result => topTv.push(result)); storeResult("top-tv", topTv); observeChildren("top-series")})
}

let fetchedRecentSeries = false
let fetchedRecentMovies = false
let alreadyLoaded = false

function fetchRecentShows() {
	fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=1&region=US`)
	.then(res => res.json())
	.then(res => {res.results.forEach(result => recentShows.push(result)); storeResult("recent-shows", recentShows); fetchedRecentSeries=true; check()})
	
	fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${key}&language=en-US&page=1&region=US`)
	.then(res => res.json())
	.then(res => {res.results.forEach(result => recentShows.push(result)); storeResult("recent-shows", recentShows); fetchedRecentMovies=true; check()})
}

function check() {
	if (!alreadyLoaded) {
		if (fetchedRecentSeries && fetchedRecentMovies) {
			observeChildren("recent-shows")
			alreadyLoaded = true
		}
	}
}

let scrollObserver = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			show(entry.target)
		}
	})
}, {threshold: 0.25})

function observeChildren(parentId) {
	let parentContainer = document.getElementById(parentId)
	let mediaContainers = parentContainer.querySelectorAll(".media-container")
	let film = undefined
	for (let i = 0; i < mediaContainers.length; i++) {
		film = mediaContainers[i]
		scrollObserver.observe(film)
	}
}

function show(element) {
	let dataList = undefined
	scrollObserver.unobserve(element)
	if (element.parentNode.id == "top-movies"){
		dataList = topMovies
	}else if(element.parentNode.id == "top-series"){
		dataList = topTv
	}else if(element.parentNode.id = "upcoming"){
		dataList = upcomingMovies
	}
	let parentContainer = document.getElementById(dataList[0].targetContainerId)
	let mediaContainers = parentContainer.querySelectorAll(".media-container")
	let currentIndex = dataList[0].currentIndex
	let mediaData = dataList[currentIndex]
	let poster = mediaContainers[currentIndex - 1].querySelector(".poster-img")
	url = `https://image.tmdb.org/t/p/w342${mediaData.poster_path}`
	poster.style.backgroundImage = `url('${url}')`
	poster.classList.remove("skeleton")
	let name = document.createElement("div")
	let littleDetails = document.createElement("div")
	let releaseYear = document.createElement("span")
	let mediaGenres = document.createElement("div")
	let genresList = []
	let skeletonTexts = mediaContainers[currentIndex - 1].querySelectorAll(".skeleton-text")
	name.id = "name"
	littleDetails.id = "little-details" 
	if (dataList[0].type == "movie") {
		name.textContent = mediaData.title
		genresList = movieGenres.genres
		releaseYear.textContent = mediaData.release_date.slice(0, 4)
	}else if (dataList[0].type == "tv") {
		name.textContent = mediaData.name
		genresList = tvGenres.genres
		releaseYear.textContent = "Since " + mediaData.first_air_date.slice(0, 4)
	}else {
		if (mediaData.media_type == "movie") {
			name.textContent = mediaData.title
			genresList = movieGenres.genres
			releaseYear.textContent = mediaData.release_date.slice(0, 4)
		}else {
			name.textContent = mediaData.name
			genresList = tvGenres.genres
			releaseYear.textContent = "Since " + mediaData.first_air_date.slice(0, 4)	
		}
	}
	mediaGenres.textContent = " | "
	for (let n=0; n < mediaData.genre_ids.length; n++) {
		for (let e=0; e < genresList.length; e++) {
			if (mediaData.genre_ids[n] == genresList[e].id) {
				if (mediaData.genre_ids[n] != mediaData.genre_ids[mediaData.genre_ids.length-1]) {
					mediaGenres.textContent += genresList[e].name + ', '
					break
				}else {
					mediaGenres.textContent += genresList[e].name
					break
				}
			}
		}
	}
	littleDetails.appendChild(releaseYear)
	littleDetails.appendChild(mediaGenres)
	for (let l=0; l<skeletonTexts.length; l++) {
		mediaContainers[currentIndex - 1].removeChild(skeletonTexts[l])
	}
	mediaContainers[currentIndex - 1].appendChild(name)
	mediaContainers[currentIndex - 1].appendChild(littleDetails)
	dataList[0].currentIndex += 1
}
