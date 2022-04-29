window.onbeforeunload = function() {window.scrollTo(0, 0)}
let key = "b44b2b9e1045ae57b5c211d94cc010d9"
let genre_page_link = "genres/genre_result.html"
let pageName = "Home"
let trendingMoviesContainer = document.getElementById("trending-movies-container")
// trendingMoviesContainer.style.height = '' + Math.round(trendingMoviesContainer.clientWidth/1.78) + 'px'

function skeletonLoader(parentId, templateChild, max_no) {
	let parentContainer = document.getElementById(parentId)
	let reachedEndOfContainer = false
	let no = 20
	if (parentId == "recent-shows") no = 40
	if (parentId == "trending-movies-container") no=3
	let dummyContainersNo = undefined
	let skeletonFragment = new DocumentFragment()
	if (max_no - parentContainer.children.length < 20) {
		no = max_no - parentContainer.children.length
		reachedEndOfContainer = true
	}
	for (let i=0; i<no; i++) {
		let skeleton = document.querySelector("template").content[templateChild].cloneNode(true)
		skeletonFragment.appendChild(skeleton)
	}
	if (reachedEndOfContainer) {
		let theEnd = document.querySelector("template").content.children[1].cloneNode(true)
		skeletonFragment.appendChild(theEnd)
		if (no>5) {
			dummyContainersNo = no%5
		}else {
			dummyContainersNo = 5 - no 
		}
		dummyContainersNo -= 1
		for (let k=0; k<dummyContainersNo; k++) {
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

let trendingMovies = document.querySelectorAll(".trending-movie")
let media = []
let trendingMoviesDetails = []

fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${key}`)
.then(response => response.json())
.then(response => {filterTrendingMovies(response.results); getTrendingMoviesDetails(media)})

function filterTrendingMovies(list) {
	let index = 0;
	let releaseDate = undefined
	for (let i = 0, l=list.length; i < l; i++) {
		let medium = {}
		if (index < trendingMovies.length) {
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
		fetch(`https://api.themoviedb.org/3/${mediaList[i].type}/${mediaList[i].id}?api_key=${key}&language=en-US&append_to_response=videos`)
		.then(response => response.json())
		.then(response => {trendingMoviesDetails.push(response); updateTrendingMovies(trendingMoviesDetails, movieNo); movieNo += 1})
	}
}

let trendingMoviePoster = document.createElement("img")

function updateTrendingMovies(details, i) {
	let posterLink = `https://image.tmdb.org/t/p/w1280${details[i].backdrop_path}`
	trendingMoviePoster.src = posterLink
	let mediaName = trendingMovies[i].querySelector(".media-name")
	let genres = trendingMovies[i].querySelector(".trending-genres")
	let trailer = trendingMovies[i].querySelector("#trailer-link")
	let overview = trendingMovies[i].querySelector(".overview")
	let releaseDateandType = trendingMovies[i].querySelector(".media-type-nd-release-date")
	let releaseDate = document.createElement("div")
	let mediaType = document.createElement("div")
	let mediaDetails = trendingMovies[i].querySelector(".details")
	trendingMovies[i].insertBefore(trendingMoviePoster.cloneNode(true), mediaDetails)
	if (i == 1) trendingMoviesContainer.style.height = "unset"
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
			trailer.href=`https://www.youtube.com/embed/${details[i].videos.results[v].key}`
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
	trendingMovies[i].classList.remove("skeleton")
}

function trimText(text) {
	if (text.length > 200) {
		text = text.slice(0, 200)
		return text
	}else return text
}

let sectionNamesContainer = document.getElementById("section-names")
let sectionNames = Array.from(sectionNamesContainer.querySelectorAll("div"))
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
let recentShows = [{currentIndex: 1, type: "both", targetContainerId: "recent-shows", moviesCurrentPage: 1,
					seriesCurrentPage: 1, series_max_length: undefined, movies_max_length: undefined,
					seriesLastPage: false, moviesLastPage: false}]
let topMovies = [{currentIndex: 1, type: "movie", targetContainerId: "top-movies",
				  currentPage: 1, endOfPages: false, max_length: undefined}]
let topTv = [{currentIndex: 1, type: "tv", targetContainerId: "top-series",
			  currentPage: 1, endOfPages: false, max_length: undefined}]
let upcomingMovies = [{currentIndex: 1, type: "movie", targetContainerId: "upcoming",
					   currentPage: 1, endOfPages: false, max_length: undefined}]

skeletonLoader("top-movies", "firstElementChild")
skeletonLoader("top-series", "firstElementChild")
skeletonLoader("upcoming", "firstElementChild")
skeletonLoader("recent-shows", "firstElementChild")

fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {
	movieGenres=res.genres; fetchtopMovies(); fetchRecentMovies(recentShows.moviesCurrentPage);
	fetchUpcomingMovies(upcomingMovies[0].currentPage);
})

fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {tvGenres=res.genres; fetchTopTvSeries(); fetchRecentSeries(recentShows.seriesCurrentPage)})

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

function check() {
	if (!alreadyLoaded) {
		if (fetchedRecentSeries && fetchedRecentMovies) {
			observeChildren("recent-shows", recent_no)
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

function observeChildren(parentId, no) {
	let parentContainer = document.getElementById(parentId)
	let iterator = (parentContainer.children.length)-no
	let mediaContainers = parentContainer.querySelectorAll(".media-container")
	let film = undefined
	for (let i = iterator; i < parentContainer.children.length; i++) {
		film = mediaContainers[i]
		scrollObserver.observe(film)
	}
}

let moviePoster = document.createElement("img")
moviePoster.style.width = "100%"
moviePoster.classList.add("poster-img")
let movieDetails = new DocumentFragment()

function show(element) {
	let dataList = undefined
	scrollObserver.unobserve(element)
	if (element.parentNode.id == "top-movies"){
		dataList = topMovies
	}else if (element.parentNode.id == "top-series"){
		dataList = topTv
	}else if (element.parentNode.id == "upcoming"){
		dataList = upcomingMovies
	}else {dataList = recentShows}
	let parentContainer = document.getElementById(dataList[0].targetContainerId)
	let mediaContainers = parentContainer.querySelectorAll(".media-container")
	let currentIndex = dataList[0].currentIndex
	let mediaData = dataList[currentIndex]
	let poster = mediaContainers[currentIndex - 1].querySelector(".poster-img")
	moviePoster.src = `https://image.tmdb.org/t/p/w342${mediaData.poster_path}`
	poster.classList.remove("skeleton")
	let name = document.createElement("div")
	let littleDetails = document.createElement("div")
	let releaseYear = document.createElement("span")
	let mediaGenres = document.createElement("div")
	let genresList = []
	let skeletonTexts = mediaContainers[currentIndex - 1].querySelectorAll(".skeleton")
	name.id = "name"
	littleDetails.id = "little-details" 
	if (dataList[0].type == "movie") {
		name.textContent = mediaData.title
		genresList = movieGenres
		releaseYear.textContent = mediaData.release_date.slice(0, 4)
	}else if (dataList[0].type == "tv") {
		name.textContent = mediaData.name
		genresList = tvGenres
		releaseYear.textContent = "Since " + mediaData.first_air_date.slice(0, 4)
	}else {
		if (mediaData.hasOwnProperty("release_date")) {
			name.textContent = mediaData.title
			genresList = movieGenres
			releaseYear.textContent = mediaData.release_date.slice(0, 4)
		}else {
			name.textContent = mediaData.name
			genresList = tvGenres
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
	mediaContainers[currentIndex - 1].removeChild(poster)
	movieDetails.appendChild(moviePoster.cloneNode(true))
	movieDetails.appendChild(name)
	movieDetails.appendChild(littleDetails)
	mediaContainers[currentIndex - 1].appendChild(movieDetails)

	if (dataList[0].currentIndex == (dataList.length-11)) {
		if (dataList[0].targetContainerId == "upcoming") {
			dataList[0].currentPage += 1
			skeletonLoader("upcoming", "firstElementChild", dataList[0].max_length)
			fetchUpcomingMovies(dataList[0].currentPage)
		}
		if (dataList[0].targetContainerId == "recent-shows") {
			dataList[0].moviesCurrentPage += 1
			dataList[0].seriesCurrentPage += 1
			alreadyLoaded = false
			skeletonLoader("recent-shows", "firstElementChild", dataList[0].movies_max_length)
			skeletonLoader("recent-shows", "firstElementChild", dataList[0].series_max_length)
			fetchRecentMovies(dataList[0].moviesCurrentPage)
			fetchRecentSeries(dataList[0].seriesCurrentPage)
		}
	}
	dataList[0].currentIndex += 1
}
