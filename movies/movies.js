window.onbeforeunload = function() {window.scrollTo(0, 0)}

let key = "b44b2b9e1045ae57b5c211d94cc010d9"
let moviesContainer = document.getElementById("movies-container")
let genresList = []
let genre_page_link = "../genres/genre_result.html"
// global variable to be used in genres.js file
let pageName = "movies page"

/** Function that displays elements skeleton while content loads
* @param {int}max_no	 Total no of content received from the api
*/
function skeletonLoader(parentId, templateChild, max_no) {
	let parentContainer = document.getElementById(parentId)
	let reachedEndOfContainer = false
	// Default no of skeletons to be loaded each time function is called
	let no = 20
	let dummyContainersNo = undefined
	let skeletonFragment = new DocumentFragment()
	/* To prevent adding more skeletons than content, It checks if unloaded content is greater than default
	skeletons to load */
	if (max_no) {
		if (max_no - parentContainer.children.length < 20) {
			no = max_no - parentContainer.children.length
			reachedEndOfContainer = true 
		}
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

skeletonLoader("movies-container", "firstElementChild")

/* The first object in the list is used to track how many films has been loaded, what type of film is it storing,
the parent Container the films are to be appended to and when there is no more content to be loaded */
let movieList = [{currentIndex: 1, currentPage: 1, endOfPages: false, max_length: undefined}]

let options_is_displayed = false
let currentValue = document.querySelector("#current-value")
// Movies page movie filter
let filter = document.querySelector("#filter")
filter.addEventListener("click", showOptions,)
// filter drop down
let filterOptionsContainer = filter.querySelector("#options")
let filterOptions = document.querySelectorAll("option")
// Elements that will render all other elements unclickable by covering them up once filter drop down is on screen
let filterCovers = document.querySelectorAll(".filter-cover")

for (let i=0,f=filterCovers.length; i<f; i++) {
	filterCovers[i].addEventListener("click", showOptions)
}

// Add Click event listeners that changes current filter option once another option is clicked
for (let i=0, f=filterOptions.length; i<f; i++) {
	filterOptions[i].addEventListener("click", () => {
		if (filterOptions[i].textContent != currentValue.textContent){
			let currentOption = filter.querySelector("#current-option")
			currentOption.removeAttribute("id")
			filterOptions[i].id = "current-option"
			currentValue.innerHTML = `${filterOptions[i].textContent}
			<span class="material-icons-outlined">arrow_drop_down</span>`
			fetchSelectedOption(filterOptions[i].value)
		}
		window.scrollTo(0, 0)
	})
}

function renderFilterCovers(display) {
	for (let i=0,f=filterCovers.length; i<f; i++) {
		filterCovers[i].style.display = display
	}
}

// Display filter options drop down
function showOptions() {
	if (!options_is_displayed) {
		renderFilterCovers("block")
		filterOptionsContainer.style.transform = "scaleY(1)"
		options_is_displayed = true
	}else {
		setTimeout(()=>{
			// Delay is added to show (by background-color change) that an option was clicked before drop down disappears
			renderFilterCovers("none")
			filterOptionsContainer.style.transform = "scaleY(0)"
			options_is_displayed = false
		}, 200)
	}
}

function fetchSelectedOption(value) {
	moviesContainer.innerHTML = ""
	movieList = [{currentIndex: 1, currentPage: 1, endOfPages: false, max_length: undefined}]
	skeletonLoader("movies-container", "firstElementChild")
	if (value == "popular") {
		fetchPopularMovies(1)
	}else if (value == "in-cinemas") {
		fetchMoviesInCinemas(1)
	}else fetchTopRatedMovies(1)
}

fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {genresList = res.genres; fetchPopularMovies(1);})

function fetchPopularMovies(page) {
	if (!movieList.endOfPages) {
		fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&page=${page}`)
		.then(res => res.json())
		.then(res => {
			movieList[0].max_length = res.total_results;
			res.results.forEach(result => movieList.push(result)); 
			observeChildren("movies-container", res.results.length)
			if (page == res.total_pages) {
				movieList.endOfPages = true
			}
		})
	}
}

function fetchMoviesInCinemas(page) {
	if (!movieList.endOfPages) {
		fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=${page}&region=US`)
		.then(res => res.json())
		.then(res => {
			movieList[0].max_length = res.total_results;
			res.results.forEach(result => movieList.push(result)); 
			observeChildren("movies-container", res.results.length)
			if (page == res.total_pages) {
				movieList.endOfPages = true
			}
		})
	}
}

function fetchTopRatedMovies(page){
	if (!movieList.endOfPages) {
		fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${key}&language=en-US&page=${page}&region=US`)
		.then(res => res.json())
		.then(res => {
			movieList[0].max_length = res.total_results;
			res.results.forEach(result => movieList.push(result)); 
			observeChildren("movies-container", res.results.length)
			if (page == res.total_pages) {
				movieList.endOfPages = true
			}
		})
	}
}

/** function to observe children of containers with the Intersection Observer
* @param {string}parentId	children parent_Container Id 
* @param {int}no 			no of content (children elements details) that was received from api response
*/
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

// Intersection observer to load film only when it's visible on screen
let scrollObserver = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			displayFilm(entry.target)
		}
	})
}, {threshold: 0.25})

let moviePoster = document.createElement("img")
moviePoster.classList.add("poster-img")
let movieDetails = new DocumentFragment()

/** Function that stores film details for full_details page when film link is clicked bcos all this website 
*	can actually do is make requests to an external api (no actual server side). Clicked film details will 
*	be stored in sessionStorage and loaded when full_details page is loaded.
*	@param {string}filmId: id of the clicked movie link,  will be used when making request to the api when the page is loaded
*	@param {string}filmType: could be movie or tv series, will also be used when making request to the api when the page is loaded
*/
function storeFilmId(filmId, filmType) {
	let filmData = {"filmId": filmId, "filmType": filmType}
	sessionStorage.setItem("filmData", JSON.stringify(filmData))
}

// Function that loads Element(film) content once the element is on screen
function displayFilm(film) {
	let dataList = movieList
	scrollObserver.unobserve(film)
	let parentContainer = document.getElementById("movies-container")
	let mediaContainers = parentContainer.querySelectorAll(".media-container")
	let currentIndex = dataList[0].currentIndex
	let mediaData = dataList[currentIndex]
	let posterContainer = mediaContainers[currentIndex - 1].querySelector(".poster-img-container")
	moviePoster.src = `https://image.tmdb.org/t/p/w500${mediaData.poster_path}`
	let name = document.createElement("a")
	let littleDetails = document.createElement("div")
	let releaseYear = document.createElement("span")
	let mediaGenres = document.createElement("div")
	let skeletonTexts = mediaContainers[currentIndex - 1].querySelectorAll(".skeleton")
	name.classList.add("name")
	name.id = mediaData.id
	name.href = "../film_full_details/full_details.html"
	name.addEventListener("click", () => {storeFilmId(name.id, "movie")})
	littleDetails.classList.add("little-details") 
	name.textContent = mediaData.title
	releaseYear.textContent = mediaData.release_date.slice(0, 4)
	mediaGenres.textContent = " | " + loadGenres(mediaData.genre_ids, genresList)
	littleDetails.appendChild(releaseYear)
	littleDetails.appendChild(mediaGenres)
	for (let l=0; l<skeletonTexts.length; l++) {
		mediaContainers[currentIndex - 1].removeChild(skeletonTexts[l])
	}
	posterContainer.appendChild(moviePoster.cloneNode(true))
	movieDetails.appendChild(name)
	movieDetails.appendChild(littleDetails)
	mediaContainers[currentIndex - 1].appendChild(movieDetails)

	if (dataList[0].currentIndex == (dataList.length-1)/2) {
		dataList[0].currentPage += 1
		skeletonLoader("movies-container", "firstElementChild", dataList[0].max_length)
		if (currentValue == "popular") {
			fetchPopularMovies(dataList[0].currentPage)
		}else if (currentValue == "in-cinemas") {
			fetchMoviesInCinemas(dataList[0].currentPage)
		}else fetchTopRatedMovies(dataList[0].currentPage)
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
