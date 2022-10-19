window.onbeforeunload = function() {window.scrollTo(0, 0)}

let key = "b44b2b9e1045ae57b5c211d94cc010d9"
let genre_page_link = "genres/genre_result.html"
// global variable to be used in genres.js file
let pageName = "all"
let trendingMoviesContainer = document.getElementById("trending-movies-container")
let touch_start;
let touch_end;

/** Function that displays elements skeleton while content loads
* @param {int}max_no	 Total no of content received from the api
*/
function skeletonLoader(parentId, templateChild, max_no) {
	let parentContainer = document.getElementById(parentId)
	let reachedEndOfContainer = false
	// Default no of skeletons to be loaded each time function is called
	let no = 20
	if (parentId == "recent-shows") no = 40
	if (parentId == "trending-movies-container") no=3
	// No of containers to fill up empty space if there's any after loading all films in a section
	let dummyContainersNo = undefined
	let skeletonFragment = new DocumentFragment()
	/* To prevent adding more skeletons than content, It checks if unloaded content is greater than default
	skeletons to load */
	if (max_no - parentContainer.children.length < 20) {
		no = max_no - parentContainer.children.length
		reachedEndOfContainer = true
	}
	for (let i=0; i<no; i++) {
		// Get the appropriate skeleton template element as passed into the function argument
		let skeleton = document.querySelector("template").content[templateChild].cloneNode(true)
		skeletonFragment.appendChild(skeleton)
	}
	if (reachedEndOfContainer) {
		// Get the element that displays when User has reached the end of Content
		let theEnd = document.querySelector("template").content.children[1].cloneNode(true)
		skeletonFragment.appendChild(theEnd)
		if (no>5) {
			// Get the no of empty space left
			dummyContainersNo = no%5
			dummyContainersNo = 5 - dummyContainersNo 
		}else {
			dummyContainersNo = 5 - no 
		}
		dummyContainersNo -= 1
		for (let k=0; k<dummyContainersNo; k++) {
			// Creates and append the empty containers needed to fill up space and stop the UI from breaking
			let dummyContainer = document.createElement("div")
			dummyContainer.style.minHeight = "0"
			dummyContainer.classList.add("media-container")
			skeletonFragment.appendChild(dummyContainer)
		}
		dummyContainersNo = undefined
	}
	parentContainer.appendChild(skeletonFragment)
}

skeletonLoader("trending-movies-container", "lastElementChild")

let vel = 0
let navLeft = document.getElementById("move-left")
let navRight = document.getElementById("move-right")
let bottomStatus = document.getElementById("bottom-status")
let status = bottomStatus.querySelectorAll("div")
status = Array.from(status)
statusIndex = 0

// Moves trending films images to the left
function moveImagesLeft() {
	if (vel != -200) {
		vel -= 100
		for (let i=0; i<trendingMovies.length; i++) {
			trendingMovies[i].style.cssText = `
			-webkit-transform: translateX(${vel}%);
			-moz-transform: translateX(${vel}%);
			-o-transform: translateX(${vel}%);
			-ms-transform: translateX(${vel}%);
			transform: translateX(${vel}%);`
		}
		status[statusIndex].removeAttribute("id")
		statusIndex += 1
		status[statusIndex].id = "current"
	}
}

// Moves trending films images to the right
function moveImagesRight() {
	if (vel != 0) {
		vel += 100
		for (let i=0; i<trendingMovies.length; i++) {
			trendingMovies[i].style.cssText = `
			-webkit-transform: translateX(${vel}%);-moz-transform: translateX(${vel}%);
			-o-transform: translateX(${vel}%);
			-ms-transform: translateX(${vel}%);
			transform: translateX(${vel}%);`
		}
		status[statusIndex].removeAttribute("id")
		statusIndex -= 1
		status[statusIndex].id = "current"
	}
}

navLeft.addEventListener("click", moveImagesLeft)
navRight.addEventListener("click", moveImagesRight)

// Moving trending films images on touch screens
trendingMoviesContainer.addEventListener('touchstart', event => {
	touch_start = event.changedTouches[0].screenX
})
trendingMoviesContainer.addEventListener('touchend', event => {
	touch_end = event.changedTouches[0].screenX
	determineDirection()
})

function determineDirection() {
	if (touch_end > touch_start) {
		moveImagesRight()
	}else if (touch_start > touch_end) {
		moveImagesLeft()
	}
}

let trendingMovies = document.querySelectorAll(".trending-movie")
let media = []
let trendingMoviesDetails = []

// Api call to get trending films for the day
fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${key}`)
.then(response => response.json())
.then(response => {filterTrendingMovies(response.results, 7); getTrendingMoviesDetails(media)})

// Filter trending films movies api response with vote_average and release onths
function filterTrendingMovies(list, good_rating) {
	let index = 0;
	let releaseDate = undefined
	for (let i = 0, l=list.length; i < l; i++) {
		let medium = {}
		if (index < trendingMovies.length) {
			if (list[i].vote_average >= good_rating) {
				if (list[i].hasOwnProperty("first_air_date")) {
					// if film is a tv-series
					releaseDate = list[i].first_air_date
					medium.type = "tv"
				}else {
					// film must be a movie
					releaseDate = list[i].release_date
					medium.type = "movie"
				}
				releaseYear = releaseDate.slice(0, 4)
				releaseMonth = releaseDate.slice(5, 7)
				date = new Date()
				if (date.getFullYear() == releaseYear) {
					if (date.getMonth() + 1 == parseInt(releaseMonth) || parseInt(releaseMonth) == date.getMonth()) {
						// if film release_month is the current month or the previous month
						index += 1
						medium.id = list[i].id
						media.push(medium)
					}
				}
			}
		}else {break}
	}
}

// Fetch full details of filtered trending movies
function getTrendingMoviesDetails(mediaList) {
	// variable to track current trending movie container that's being updated
	let movieNo = 0
	for (let i=0; i<mediaList.length; i++) {
		fetch(`https://api.themoviedb.org/3/${mediaList[i].type}/${mediaList[i].id}?api_key=${key}&language=en-US&append_to_response=videos`)
		.then(response => response.json())
		.then(response => {
			trendingMoviesDetails.push(response)
			updateTrendingMovies(trendingMoviesDetails, movieNo)
			movieNo += 1
		})
	}
}

let trendingMoviePoster = document.createElement("img")

function updateTrendingMovies(details, i) {
	let posterLink = `https://image.tmdb.org/t/p/w1280${details[i].backdrop_path}`
	trendingMoviePoster.src = posterLink
	let mediaName = trendingMovies[i].querySelector(".media-name")
	let genres = trendingMovies[i].querySelector(".trending-genres")
	let overview = trendingMovies[i].querySelector(".overview")
	let releaseDateandType = trendingMovies[i].querySelector(".media-type-nd-release-date")
	let releaseDate = document.createElement("div")
	let mediaType = document.createElement("div")
	let mediaDetails = trendingMovies[i].querySelector(".details")
	let fullDetailsLink = trendingMovies[i].querySelector(".full-details-link")
	fullDetailsLink.textContent = "Full details"
	trendingMovies[i].insertBefore(trendingMoviePoster.cloneNode(true), mediaDetails)
	if (details[i].original_name) {
		mediaName.textContent = details[i].name
		mediaName.href = `film_full_details/full_details.html?id=${details[i].id}&type=tv`
		fullDetailsLink.href = `film_full_details/full_details.html?id=${details[i].id}&type=tv`
		releaseDate.textContent = `first episode date: ${details[i].first_air_date}`
		mediaType.textContent = "Tv Series"
		releaseDateandType.appendChild(releaseDate)
		releaseDateandType.appendChild(mediaType)
	}else {
		mediaName.textContent = details[i].title
		mediaName.href = `film_full_details/full_details.html?id=${details[i].id}&type=movie`
		fullDetailsLink.href = `film_full_details/full_details.html?id=${details[i].id}&type=movie`
		releaseDate.textContent = `Release date: ${details[i].release_date}`
		mediaType.textContent = "Movie"
		releaseDateandType.appendChild(releaseDate)
		releaseDateandType.appendChild(mediaType)
	}
	genres.innerHTML = ""
	for (let n=0; n<details[i].genres.length; n++) {
		genre = document.createElement("div")
		genre.textContent = details[i].genres[n].name
		genres.appendChild(genre)
	}
	overview.innerHTML = ""
	overview.textContent = trimText(details[i].overview) 
	trendingMovies[i].classList.remove("skeleton")
}

// Trim film overviews with more than 200 characters
function trimText(text) {
	if (text.length > 200) {
		text = text.slice(0, 200)
		return text + "..."
	}else return text
}

let sectionNamesContainer = document.getElementById("section-names")
// Home page film sections links
let sectionNames = Array.from(sectionNamesContainer.querySelectorAll("a"))
// Home page film sections
let sections = document.querySelectorAll('.sections')
sections = Array.from(sections)

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
	// section names links indexes corresponds to section indexes
	let newIndex = sectionNames.indexOf(clickedSection)
	let oldIndex = sectionNames.indexOf(currentSection)
	sections[oldIndex].style.display = 'none'
	if (newIndex != 0) {
		if (window.innerWidth > 400)
			sections[newIndex].style.display = 'flex'
		else sections[newIndex].style.display = 'block'
	}else {
		sections[newIndex].style.display = 'block'
	}
}

let movieGenres = [] 
let tvGenres = []

/* Each section on the home page has a list to store Content details (as objects) as it is received from the api 
The first object in each list is used to track how many films has been loaded, what type of film is it storing,
the parent Container the films are to be appended to and when there is no more content to be loaded */
let recentShows = [{currentIndex: 1, type: "both", targetContainerId: "recent-shows", moviesCurrentPage: 1,
					seriesCurrentPage: 1, series_max_length: undefined, movies_max_length: undefined,
					seriesLastPage: false, moviesLastPage: false}]
let topMovies = [{currentIndex: 1, type: "movie", targetContainerId: "top-movies",
				  currentPage: 1, endOfPages: false, max_length: undefined}]
let topTv = [{currentIndex: 1, type: "tv", targetContainerId: "top-series",
			  currentPage: 1, endOfPages: false, max_length: undefined}]
let upcomingMovies = [{currentIndex: 1, type: "movie", targetContainerId: "upcoming",
					   currentPage: 1, endOfPages: false, max_length: undefined}]

/* Load Content Skeletons for each section on homepage */
skeletonLoader("top-movies", "firstElementChild")
skeletonLoader("top-series", "firstElementChild")
skeletonLoader("upcoming", "firstElementChild")
skeletonLoader("recent-shows", "firstElementChild")

// fetch movie Genres and id key-value pairs
fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {
	// assign response to movieGenres variable and fetch the following movies Sections
	movieGenres=res.genres; fetchtopMovies(); fetchRecentMovies(recentShows.moviesCurrentPage);
	fetchUpcomingMovies(upcomingMovies[0].currentPage);
})

// fetch tv Genres and id key-value pairs
fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {
	// assign response to tvGenres variable and fetch the following tv Sections
	tvGenres=res.genres; fetchTopTvSeries(); fetchRecentSeries(recentShows.seriesCurrentPage)
})

function fetchtopMovies() {
	fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&page=1`)
	.then(res => res.json())
	.then(res => {
		res.results.forEach(result => topMovies.push(result)); observeChildren("top-movies", res.results.length)
	})
}

function fetchUpcomingMovies(page) {
	if (!upcomingMovies.endOfPages) {
		fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=${page}&region=US`)
		.then(res => res.json())
		.then(res => {
			upcomingMovies[0].max_length = res.total_results;
			res.results.forEach(result => upcomingMovies.push(result));
			observeChildren("upcoming", res.results.length)
			if (page == res.total_pages) {
				upcomingMovies.endOfPages = true
			}
		})
	}
}

function fetchTopTvSeries() {
	fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${key}&page=1`)
	.then(res => res.json())
	.then(res => {res.results.forEach(result => topTv.push(result)); observeChildren("top-series", res.results.length)})
}

let fetchedRecentSeries = false
let fetchedRecentMovies = false
let alreadyLoaded = false
let recent_no = 0

function fetchRecentMovies(page) {
	if (!recentShows.moviesLastPage) {
		fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=${page}&region=US`)
		.then(res => res.json())
		.then(res => {
			recentShows[0].movies_max_length = res.total_results
			recent_no += res.results.length;
			recentShows.movies_max_length = res.total_results;
			res.results.forEach(result => recentShows.push(result));
			fetchedRecentMovies=true; check()
			if (page == res.total_pages) {
				recentShows.moviesLastPage = true
			}
		})
	}
}

function fetchRecentSeries(page) {
	if (!recentShows.seriesLastPage) {
		fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${key}&language=en-US&page=${page}&region=US`)
		.then(res => res.json())
		.then(res => {
			recentShows[0].series_max_length = res.total_results
			recent_no += res.results.length;
			recentShows.series_max_length = res.total_results;
			res.results.forEach(result => recentShows.push(result));
			fetchedRecentSeries=true; check()
			if (page == res.total_pages) {
				recentShows.seriesLastPage = true
			}
		})

	}
}

//function to check if recent tv series and recent movies has been fetched
function check() {
	if (!alreadyLoaded) {
		if (fetchedRecentSeries && fetchedRecentMovies) {
			observeChildren("recent-shows", recent_no)
			alreadyLoaded = true
		}
	}
}

// Intersection observer to load film only when it's visible on screen
let scrollObserver = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			displayFilm(entry.target)
		}
	})
}, {threshold: 0.25})

/** function to observe children of containers with the Intersection Observer
* @param {string}parentId	children parent_Container Id 
* @param {int}no 			no of content (children elements details) that was received from api response
*/
function observeChildren(parentId, no) {
	let parentContainer = document.getElementById(parentId)
	let iterator = (parentContainer.children.length) - no
	let mediaContainer = parentContainer.querySelectorAll(".media-container")
	let film = undefined
	for (let i = iterator, p = parentContainer.children.length; i < p; i++) {
		film = mediaContainer[i]
		scrollObserver.observe(film)
	}
}

let moviePoster = document.createElement("img")
moviePoster.classList.add("poster-img")
let movieDetails = new DocumentFragment()

// Function that loads Element (film) content once the element is on screen
function displayFilm(film) {
	let dataList = undefined
	scrollObserver.unobserve(film)
	if (film.parentNode.id == "top-movies") {
		dataList = topMovies
	}else if (film.parentNode.id == "top-series") {
		dataList = topTv
	}else if (film.parentNode.id == "upcoming") {
		dataList = upcomingMovies
	}else {dataList = recentShows}
	let parentContainer = document.getElementById(dataList[0].targetContainerId)
	let mediaContainer = parentContainer.querySelectorAll(".media-container")
	let currentIndex = dataList[0].currentIndex
	let mediaData = dataList[currentIndex]
	let posterContainer = mediaContainer[currentIndex - 1].querySelector(".poster-img-container")
	moviePoster.src = `https://image.tmdb.org/t/p/w500${mediaData.poster_path}`
	let name = document.createElement("a")
	let littleDetails = document.createElement("div")
	let releaseYear = document.createElement("span")
	let mediaGenres = document.createElement("div")
	let genresList = []
	let skeletonTexts = mediaContainer[currentIndex - 1].querySelectorAll(".skeleton")
	name.classList.add("name")
	name.id = mediaData.id
	littleDetails.classList.add("little-details") 
	if (mediaData.hasOwnProperty("release_date")) {
		name.textContent = mediaData.title
		name.href = `film_full_details/full_details.html?id=${name.id}&type=movie`
		genresList = movieGenres
		releaseYear.textContent = mediaData.release_date.slice(0, 4)
	}else {
		name.textContent = mediaData.name
		name.href = `film_full_details/full_details.html?id=${name.id}&type=tv`
		genresList = tvGenres
		releaseYear.textContent = "Since " + mediaData.first_air_date.slice(0, 4)
	}
	mediaGenres.textContent = " | " + loadGenres(mediaData.genre_ids, genresList)
	littleDetails.appendChild(releaseYear)
	littleDetails.appendChild(mediaGenres)
	for (let l=0; l<skeletonTexts.length; l++) {
		mediaContainer[currentIndex - 1].removeChild(skeletonTexts[l])
	}
	posterContainer.appendChild(moviePoster.cloneNode(true))
	movieDetails.appendChild(name)
	movieDetails.appendChild(littleDetails)
	mediaContainer[currentIndex - 1].appendChild(movieDetails)

	if (dataList[0].currentIndex == (dataList.length-11)) {
		LoadMoreFilms(dataList[0])
	}
	dataList[0].currentIndex += 1
}

function loadGenres(film_genre_ids, genre_list) {
	let filmGenres = '';
	for (let n=0, f=film_genre_ids.length; n < f; n++) {
		for (let e=0, g=genre_list.length; e < g; e++) {
			if (film_genre_ids[n] == genre_list[e].id) {
				if (filmGenres.length < 38) {
					if (film_genre_ids[n] != film_genre_ids[film_genre_ids.length-1]) {
						filmGenres += genre_list[e].name + ', '
					}else {
						filmGenres += genre_list[e].name
						return filmGenres
					}
				}else {
					filmGenres = filmGenres.slice(0, filmGenres.length-2)
					return filmGenres
				}
			}
		}
	}
}

function LoadMoreFilms(filmSectionDetails) {
	if (filmSectionDetails.targetContainerId == "upcoming") {
		filmSectionDetails.currentPage += 1
		skeletonLoader("upcoming", "firstElementChild", filmSectionDetails.max_length)
		fetchUpcomingMovies(filmSectionDetails.currentPage)
	}
	if (filmSectionDetails.targetContainerId == "recent-shows") {
		filmSectionDetails.moviesCurrentPage += 1
		filmSectionDetails.seriesCurrentPage += 1
		alreadyLoaded = false
		skeletonLoader("recent-shows", "firstElementChild", filmSectionDetails.movies_max_length)
		skeletonLoader("recent-shows", "firstElementChild", filmSectionDetails.series_max_length)
		fetchRecentMovies(filmSectionDetails.moviesCurrentPage)
		fetchRecentSeries(filmSectionDetails.seriesCurrentPage)
	}
}
