let key = "b44b2b9e1045ae57b5c211d94cc010d9"
let moviesContainer = document.getElementById("movies-container")
let genresList = []

function skeletonLoader(parentId, templateChild, no, max_no) {
	let parentContainer = document.getElementById(parentId)
	if (max_no) {
		if (max_no - parentContainer.children.length < 20){
			no = max_no - parentContainer.children.length
		}
	}
	for (let i=0; i<no; i++) {
		let skeleton = document.querySelector("template").content[templateChild].cloneNode(true)
		parentContainer.appendChild(skeleton)
	}
}

skeletonLoader("movies-container", "firstElementChild", 20)

let movieList = [{currentIndex: 1, currentPage: 1, endOfPages: false, max_length: undefined}]
let currentValue = "popular"
let selected = document.querySelector("select")
selected.addEventListener("change", () => {if (selected.value != currentValue)fetchSelectedOption(selected.value); window.scrollTo(0, 0)})

function fetchSelectedOption(value) {
	moviesContainer.innerHTML = ""
	movieList = [{currentIndex: 1, currentPage: 1, endOfPages: false, max_length: undefined}]
	skeletonLoader("movies-container", "firstElementChild", 20)
	currentValue = value
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
		fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&page=1`)
		.then(res => res.json())
		.then(res => {
			movieList[0].max_length = res.total_results;
			res.results.forEach(result => movieList.push(result)); 
			observeChildren("movies-container", res.results.length)})
		if (page == res.total_pages) {
			movieList.endOfPages = true
		}
	}
}

function fetchMoviesInCinemas(page) {
	if (!movieList.endOfPages) {
		fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=${page}&region=US`)
		.then(res => res.json())
		.then(res => {
			console.log(res)
			movieList[0].max_length = res.total_results;
			res.results.forEach(result => movieList.push(result)); 
			observeChildren("movies-container", res.results.length)})
		if (page == res.total_pages) {
			movieList.endOfPages = true
		}
	}
}

function fetchTopRatedMovies(page){
	if (!movieList.endOfPages) {
		fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${key}&language=en-US&page=${page}&region=US`)
		.then(res => res.json())
		.then(res => {
			movieList[0].max_length = res.total_results;
			res.results.forEach(result => movieList.push(result)); 
			observeChildren("movies-container", res.results.length)})
		if (page == res.total_pages) {
			movieList.endOfPages = true
		}
	}
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
	let dataList = movieList
	scrollObserver.unobserve(element)
	let parentContainer = document.getElementById("movies-container")
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
	name.textContent = mediaData.title
	releaseYear.textContent = mediaData.release_date.slice(0, 4)
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
		skeletonLoader("movies-container", "firstElementChild", 20, dataList[0].max_length)
		if (currentValue == "popular") {
			fetchPopularMovies(dataList[0].currentPage)
		}else if (currentValue == "in-cinemas") {
			fetchMoviesInCinemas(dataList[0].currentPage)
		}else fetchTopRatedMovies(dataList[0].currentPage)
	}
	dataList[0].currentIndex += 1
}
