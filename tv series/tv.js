window.onbeforeunload = function() {window.scrollTo(0, 0)}

let key = "b44b2b9e1045ae57b5c211d94cc010d9"
let seriesContainer = document.getElementById("series-container")
let genresList = []

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
		if ((no%5 != 0) && parentContainer.display.type == "flex") {
			dummyContainersNo = no%5
			for(let k=0; k<dummyContainersNo; k++) {
				let dummyContainer = document.createElement("div")
				dummyContainer.classList.add("media-container")
				skeletonFragment.appendChild(dummyContainer)
			}
		}
	}
	parentContainer.appendChild(skeletonFragment)
}

skeletonLoader("series-container", "firstElementChild", 20)

let tvList = [{currentIndex: 1, currentPage: 1, endOfPages: false, max_length: undefined}]
let currentValue = "popular"
let selected = document.querySelector("select")
selected.addEventListener("change", () => {if (selected.value != currentValue)fetchSelectedOption(selected.value); window.scrollTo(0, 0)})

function fetchSelectedOption(value) {
	seriesContainer.innerHTML = ""
	tvList = [{currentIndex: 1, currentPage: 1, endOfPages: false, max_length: undefined}]
	skeletonLoader("series-container", "firstElementChild", 20)
	currentValue = value
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


function show(element) {
	let dataList = tvList
	scrollObserver.unobserve(element)
	let parentContainer = document.getElementById("series-container")
	let mediaContainers = parentContainer.querySelectorAll(".media-container")
	let currentIndex = dataList[0].currentIndex
	let mediaData = dataList[currentIndex]
	let poster = mediaContainers[currentIndex - 1].querySelector(".poster-img")
	url = `https://image.tmdb.org/t/p/w342${mediaData.poster_path}`
	poster.style.backgroundImage = `url('${url}'), url('../load_error.jpeg')`
	poster.classList.remove("skeleton")
	let name = document.createElement("div")
	let littleDetails = document.createElement("div")
	let releaseYear = document.createElement("span")
	let mediaGenres = document.createElement("div")
	let skeletonTexts = mediaContainers[currentIndex - 1].querySelectorAll(".skeleton-text")
	name.id = "name"
	littleDetails.id = "little-details" 
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
	mediaContainers[currentIndex - 1].appendChild(name)
	mediaContainers[currentIndex - 1].appendChild(littleDetails)
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

