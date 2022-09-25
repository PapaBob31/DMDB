/*
This javascript file is needed for two parts that are available on all the pages on the website
The Menu bar and site header
*/

let movieGenresList = []
let tvGenresList = []
let fetchedMovieGenresList = false
let fetchedTvGenresList = false
let not_created_yet = true
let genresContainer = document.getElementById("genres")

let form = document.getElementById("search-bar-container")
let input = form.querySelector("input")
// Stores search query in sessionStorage to be used by search page when it loads
form.addEventListener("submit", () => {
	let query = input.value
	sessionStorage.setItem("query", query)
})

let dummyGenresContainer = new DocumentFragment()

/** Function that stores film details for destination page when film link is clicked bcos all this website 
*	can actually do is make requests to an external api (no actual server side). Clicked film details will 
*	be stored in sessionStorage and loaded when destination page (e.g genres.html) is reached
*	@param {string}pageName		pageName of genre clicked, will be used in destination page
*	@param {string}id			id of the genre clicked, will be used in destination page
*/
function storeId(page_name, id) {
	let data = {section: page_name, genre_id: id}
	sessionStorage.setItem("data", JSON.stringify(data))
}

function createGenreLinks() {
	let genres;
	if (not_created_yet) {
		if (pageName == "movies page"){
			genres = movieGenresList
		}else if (pageName == "tv-series page") {
			genres = tvGenresList
		}else {
			genres = mergeMovieAndtvGenresList()
		}
		genres.forEach(result => {
			let link = document.createElement("a")
			link.id = result.id
			link.textContent = result.name
			link.href = genre_page_link
			link.addEventListener("click", (event) => {storeId(pageName, event.target.id)})
			dummyGenresContainer.append(link)
		})
		genresContainer.querySelector("div").append(dummyGenresContainer)
		not_created_yet = false
	}
}

function mergeMovieAndtvGenresList() {
	let result = []
	for (let n=0,m=movieGenresList.length; n < m; n++) {
		for (let j=0,t=tvGenresList.length; j < t; j++) {
			if (tvGenresList[j].name.includes(movieGenresList[n].name)){
				result.push({id:`${tvGenresList[j].id},${movieGenresList[n].id}`, name: movieGenresList[n].name})
				break
			}else if (movieGenresList[n].name == "Science Fiction") {
				if (tvGenresList[n].name == "Sci-Fi & Fantasy") {
					result.push({id:`${tvGenresList[j].id},${movieGenresList[n].id}`, name: movieGenresList[n].name})
				}
			}
			if (tvGenresList[j] == tvGenresList[j-1] ) {
				result.push({id: movieGenresList[n].id, name: movieGenresList[n].name})
			}
		}
	}
	not_created_yet = false
	return result
}

// Fetch all the currently available genres for movies from the api bcos this list is constantly changing
fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {
	movieGenresList=res.genres; fetchedMovieGenresList = true;
	if (fetchedTvGenresList && fetchedMovieGenresList) {
		createGenreLinks()
	}
})

// Fetch all the currently available genres for tvs from the api bcos this list is constantly changing
fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {
	tvGenresList=res.genres; fetchedTvGenresList = true;
	if (fetchedTvGenresList && fetchedMovieGenresList) {
		createGenreLinks()
	}
})

let body = document.querySelector("body")
let pageCover = document.getElementById("page-cover")
let menuIcon = document.getElementById("mobile-menu")
let menuBar = document.getElementById("menu-bar")
let closeMenu = document.getElementById("close-menu")
let menuOnscreen = false
menuIcon.addEventListener("click", showMenu)
closeMenu.addEventListener("click", hideMenu)
pageCover.addEventListener("click", hideMenu)

// For devices with small screen-width
function showMenu() {
	if (!menuOnscreen) {
		menuBar.style.left = "0"
		pageCover.style.width = "100%"
		body.style.overflow = "hidden"
		menuOnscreen = true
	}
}

// For devices with small screen-width
function hideMenu() {
	if (menuOnscreen) {
		menuBar.style.left = `-250px`
		pageCover.style.width = "0"
		body.removeAttribute('style')
		menuOnscreen = false
	}
}

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

window.addEventListener('resize', removeInlineStyles)

function removeInlineStyles() {
	if (window.innerWidth > 1000) {
		menuBar.removeAttribute('style')
		pageCover.removeAttribute('style')
		body.removeAttribute('style')
		searchBar.removeAttribute('style')
	}
}

let mobileSearchIcon = document.getElementById("mobile-search-trigger")
let searchBar = document.getElementById("search-bar-container")
let closeMobileSearchBtn = document.getElementById("close-search-bar")
mobileSearchIcon.addEventListener("click", showMobileSearchBar)
closeMobileSearchBtn.addEventListener("click", closeMobileSearchBar)
let onScreen = false

// For devices with small screen-width
function showMobileSearchBar() {
	searchBar.style.cssText = `
	-webkit-transform: scaleX(1);
	-moz-transform: scaleX(1);
	-o-transform: scaleX(1);
	-ms-transform: scaleX(1);
	transform: scaleX(1);`
}

// For devices with small screen-width
function closeMobileSearchBar() {
	searchBar.style.cssText = `
	-webkit-transform: scaleX(0);
	-moz-transform: scaleX(0);
	-o-transform: scaleX(0);
	-ms-transform: scaleX(0);
	transform: scaleX(0);`
}

