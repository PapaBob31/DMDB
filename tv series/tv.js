window.onbeforeunload = function() {window.scrollTo(0, 0)}

let key = "b44b2b9e1045ae57b5c211d94cc010d9"
let seriesContainer = document.getElementById("series-container")
let genresList = []
let genre_page_link = "../genres/genre_result.html"
let pageName = "tv-series page"

function skeletonLoader(parentId, templateChild, max_no) {
	let parentContainer = document.getElementById(parentId)
	let reachedEndOfContainer = false
	let no = 20
	let dummyContainersNo = undefined
	let skeletonFragment = new DocumentFragment()
	if (max_no) {
		if (max_no - parentContainer.children.length < 20) {
			no = max_no - parentContainer.children.length
			reachedEndOfContainer = true 
		}
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
			dummyContainersNo = 5 - dummyContainersNo 
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

skeletonLoader("series-container", "firstElementChild")

let tvList = [{currentIndex: 1, currentPage: 1, endOfPages: false, max_length: undefined}]
let options_is_displayed = false
let currentValue = document.querySelector("#current-value")
let filter = document.querySelector("#filter")
filter.addEventListener("click", showOptions,)
let filterOptionsContainer = filter.querySelector("#options")
let filterOptions = document.querySelectorAll("option")
let filterCovers = document.querySelectorAll(".filter-cover")

for (let i=0,f=filterCovers.length; i<f; i++) {
	filterCovers[i].addEventListener("click", showOptions)
}

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

function showOptions() {
	if (!options_is_displayed) {
		renderFilterCovers("block")
		filterOptionsContainer.style.transform = "scale(1, 1)"
		options_is_displayed = true
	}else {
		setTimeout(()=>{
			renderFilterCovers("none")
			filterOptionsContainer.style.transform = "scaleY(0)"
			options_is_displayed = false
		}, 200)
	}
}

function fetchSelectedOption(value) {
	seriesContainer.innerHTML = ""
	tvList = [{currentIndex: 1, currentPage: 1, endOfPages: false, max_length: undefined}]
	skeletonLoader("series-container", "firstElementChild", 20)
	if (value == "popular") {
		fetchPopularSeries(1)
	}else if (value == "currently-airing") {
		fetchCurrentlyAiring(1)
	}else fetchTopRatedSeries(1)
}

fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${key}&language=en-US`)
.then(res => res.json())
.then(res => {genresList = res.genres; fetchPopularSeries(1);})

function fetchPopularSeries(page) {
	fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${key}&page=${page}`)
	.then(res => res.json())
	.then(res => {
		console.log(res)
		tvList[0].max_length = res.total_results;
		res.results.forEach(result => tvList.push(result)); 
		observeChildren("series-container", res.results.length)})
}

function fetchCurrentlyAiring(page) {
	fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${key}&language=en-US&page=${page}&region=US`)
	.then(res => res.json())
	.then(res => {
		console.log(res)
		tvList[0].max_length = res.total_results;
		res.results.forEach(result => tvList.push(result)); 
		observeChildren("series-container", res.results.length)})
}

function fetchTopRatedSeries(page){
	fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${key}&language=en-US&page=${page}&region=US`)
	.then(res => res.json())
	.then(res => {
		console.log(res)
		tvList[0].max_length = res.total_results;
		res.results.forEach(result => tvList.push(result)); 
		observeChildren("series-container", res.results.length)})
}

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

let scrollObserver = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			show(entry.target)
		}
	})
}, {threshold: 0.25})

let moviePoster = document.createElement("img")
moviePoster.classList.add("poster-img")
let movieDetails = new DocumentFragment()

function storeFilmId(filmId, filmType) {
	let filmData = {"filmId": filmId, "filmType": filmType}
	sessionStorage.setItem("filmData", JSON.stringify(filmData))
}

function show(element) {
	let dataList = tvList
	scrollObserver.unobserve(element)
	let parentContainer = document.getElementById("series-container")
	let mediaContainers = parentContainer.querySelectorAll(".media-container")
	let currentIndex = dataList[0].currentIndex
	let mediaData = dataList[currentIndex]
	let posterContainer = mediaContainers[currentIndex - 1].querySelector(".poster-img-container")
	moviePoster.src = `https://image.tmdb.org/t/p/w342${mediaData.poster_path}`
	let name = document.createElement("a")
	let littleDetails = document.createElement("div")
	let releaseYear = document.createElement("span")
	let mediaGenres = document.createElement("div")
	let skeletonTexts = mediaContainers[currentIndex - 1].querySelectorAll(".skeleton")
	name.classList.add("name")
	name.id = mediaData.id
	name.href = "../film_full_details/full_details.html"
	name.addEventListener("click", () => {storeFilmId(name.id,  "tv")})
	littleDetails.classList.add("little-details") 
	name.textContent = mediaData.name
	releaseYear.textContent = "Since " + mediaData.first_air_date.slice(0, 4)
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
	posterContainer.appendChild(moviePoster.cloneNode(true))
	movieDetails.appendChild(name)
	movieDetails.appendChild(littleDetails)
	mediaContainers[currentIndex - 1].appendChild(movieDetails)
	if (dataList[0].currentIndex == (dataList.length-1)/2) {
		dataList[0].currentPage += 1
		skeletonLoader("series-container", "firstElementChild", dataList[0].max_length)
		if (currentValue == "popular") {
			fetchPopularSeries(dataList[0].currentPage)
		}else if (currentValue == "currently-airing") {
			fetchCurrentlyAiring(dataList[0].currentPage)
		}else fetchTopRatedSeries(dataList[0].currentPage)
	}
	dataList[0].currentIndex += 1
}
