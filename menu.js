let key = "b44b2b9e1045ae57b5c211d94cc010d9"

let movieGenres = []
let tvGenres = []

fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {movieGenres=res; console.log(movieGenres)})

fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {tvGenres=res; console.log(tvGenres)})

fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&with_genres=28`)
.then(res => res.json())
.then(res => console.log(res))

fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${key}&language=en-US&with_genres=35`)
.then(res => res.json())
.then(res => console.log(res))

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

window.addEventListener('resize', removeInlineStyles)

function removeInlineStyles() {
	if (window.innerWidth > 1000) {
		menuBar.removeAttribute('style')
	}
}

let mobileSearchIcon = document.getElementById("mobile-search-trigger")
let searchBar = document.getElementById("search-bar-container")
let closeMobileSearchBtn = document.getElementById("close-search-bar")
mobileSearchIcon.addEventListener("click", showMobileSearchBar)
closeMobileSearchBtn.addEventListener("click", closeMobileSearchBar)

let onScreen = false

function showMobileSearchBar() {
	searchBar.style.transform = 'scaleX(100%)'
}

function closeMobileSearchBar() {
	searchBar.style.transform = 'scaleX(0)'
}