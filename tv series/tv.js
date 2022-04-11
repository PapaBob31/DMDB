let key = "b44b2b9e1045ae57b5c211d94cc010d9"
let seriesContainer = document.getElementById("series-container")
let genresList = []

loadData()

function storeResult(data_name, data) {
	sessionStorage.setItem(data_name, JSON.stringify(data))
}

function loadData() {
	if (sessionStorage.getItem("top-series") != undefined) {
		tvList = JSON.parse(sessionStorage.getItem("top-series"))
		if (sessionStorage.getItem("seriesGenres") != undefined) {
			genresList = JSON.parse(sessionStorage.getItem("seriesGenres")).genres
			displayTvSeries(tvList)
		}else {
			fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${key}&language=en-US`)
			.then(response => response.json())
			.then(response => {genresList=response.genres; storeResult("seriesGenres", genresList); displayTvSeries(tvList)})
		}
	}else {
		fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${key}&page=1`)
		.then(res => res.json())
		.then(res => {storeResult("top-series", res.results); loadData()})
	}
}

function displayTvSeries(tvList) {
	for (let i=0; i<tvList.length; i++) {
		let series = document.createElement("div")
		let poster = document.createElement("img")
		let name = document.createElement("div")
		let littleDetails = document.createElement("div")
		let releaseYear = document.createElement("span")
		let mediaGenres = document.createElement("div")
		series.className = "media-container"
		poster.src = `https://image.tmdb.org/t/p/w342${tvList[i].poster_path}`
		name.id = "name"
		littleDetails.id = "little-details"
		mediaGenres.textContent = " | "
		createGenres(tvList[i], mediaGenres)
		name.textContent = tvList[i].name
		releaseYear.textContent = tvList[i].first_air_date.slice(0, 4)
		littleDetails.appendChild(releaseYear)
		littleDetails.appendChild(mediaGenres)
		series.appendChild(poster)
		series.appendChild(name)
		series.appendChild(littleDetails)
		seriesContainer.append(series)
	}
}

function createGenres(movie, genresContainer) {
	for (let n=0; n < movie.genre_ids.length; n++) {
		for (let e=0; e < genresList.length; e++) {
			if (movie.genre_ids[n] == genresList[e].id) {
				if (movie.genre_ids[n] != movie.genre_ids[movie.genre_ids.length-1]) {
					genresContainer.textContent += genresList[e].name + ', '
					break
				}else {
					genresContainer.textContent += genresList[e].name
					break
				}
			}
		} 
	}
}