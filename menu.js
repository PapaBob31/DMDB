let MovieGenres = []
let TvGenres = []
let fetchedMovieGenres = false
let fetchedTvGenres = false
let not_created_yet = true
let genresContainer = document.getElementById("genres")

let form = document.getElementById("search-bar-container")
let input = form.querySelector("input")
form.addEventListener("submit", () => {
	let query = input.value
	sessionStorage.setItem("query", query)
})

let dummyGenresContainer = new DocumentFragment()

function storeId(page_name, id) {
	let data = {section: page_name, genre_id: id}
	sessionStorage.setItem("data", JSON.stringify(data))
}

function createGenreLinks() {
	let genres;
	if (not_created_yet) {
		if (pageName == "movies page"){
			genres = MovieGenres
		}else if (pageName == "tv-series page") {
			genres = TvGenres
		}else {
			genres = mergeMovieAndTvGenres()
		}
		genres.forEach(result => {
			let link = document.createElement("a")
			link.id = result.id
			link.textContent = result.name
			link.href = genre_page_link
			link.addEventListener("click", (event) => {storeId(pageName, event.target.id); console.log("sad")})
			dummyGenresContainer.append(link)
		})
		genresContainer.append(dummyGenresContainer)
		not_created_yet = false
	}
}

function mergeMovieAndTvGenres() {
	let result = []
	for (let n=0,m=MovieGenres.length; n < m; n++) {
		for (let j=0,t=TvGenres.length; j < t; j++) {
			if (TvGenres[j].name.includes(MovieGenres[n].name)){
				result.push({id:`${TvGenres[j].id},${MovieGenres[n].id}`, name: MovieGenres[n].name})
				break
			}else if (MovieGenres[n].name == "Science Fiction") {
				if (TvGenres[n].name == "Sci-Fi & Fantasy") {
					result.push({id:`${TvGenres[j].id},${MovieGenres[n].id}`, name: MovieGenres[n].name})
				}
			}
			if (TvGenres[j] == TvGenres[j-1] ) {
				result.push({id: MovieGenres[n].id, name: MovieGenres[n].name})
			}
		}
	}
	not_created_yet = false
	return result
}

fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {
	MovieGenres=res.genres; fetchedMovieGenres = true;
	if (fetchedTvGenres && fetchedMovieGenres) {
		createGenreLinks()
	}
})

fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {
	TvGenres=res.genres; fetchedTvGenres = true;
	if (fetchedTvGenres && fetchedMovieGenres) {
		createGenreLinks()
	}
})

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
	searchBar.style.webkitTransform = 'scaleX(1)'
}

function closeMobileSearchBar() {
	searchBar.style.webkitTransform = 'scaleX(0)'
}

