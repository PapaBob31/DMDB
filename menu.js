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
let mobileSearchBar = document.getElementById("mobile-search-bar-container")
let closeMobileSearchBtn = document.getElementById("close-search-bar")
mobileSearchIcon.addEventListener("click", showMobileSearchBar)
closeMobileSearchBtn.addEventListener("click", closeMobileSearchBar)

let onScreen = false

function showMobileSearchBar() {
	if (!onScreen) {
		mobileSearchBar.style.top = '5vh'
		onScreen = true
	}else {
		mobileSearchBar.style.top = '0'
		onScreen = false
	}

}

function closeMobileSearchBar() {
	mobileSearchBar.style.top = '-5px'
}