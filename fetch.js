
let vel = 0
let navLeft = document.getElementById("move-left")
let navRight = document.getElementById("move-right")
function moveImagesLeft() {
	if (vel != -200) {
		vel -= 100
		for (let i=0; i<trendingMovies.length; i++) {
			trendingMovies[i].style.transform = `translateX(${vel}%)`
		}
	}
}

function moveImagesRight() {
	if (vel != 0) {
		vel += 100
		for (let i=0; i<trendingMovies.length; i++) {
			trendingMovies[i].style.transform = `translateX(${vel}%)`
		}
	}
}

navLeft.addEventListener("click", moveImagesLeft)
navRight.addEventListener("click", moveImagesRight)

let trendingMoviesContainer = document.getElementById("trending-movies-container")
let trendingMovies = document.querySelectorAll("#trending-movie")
trendingMovies = Array.from(trendingMovies)
let media = []
let trendingMoviesDetails = []
let key = "b44b2b9e1045ae57b5c211d94cc010d9"

function getTrendingMovies(list) {
	let index = 0;
	let releaseDate = undefined
	for (let i = 0; i < list.length; i++) {
		let medium = {}
		if (index < (trendingMovies.length)) {
			if (list[i].vote_average >= 7.9) {
				if (list[i].hasOwnProperty("first_air_date")) {
					releaseDate = list[i].first_air_date
					medium.type = "tv"
				}else {
					releaseDate = list[i].release_date
					medium.type = "movie"
				}
				releaseMonth = releaseDate.slice(5, 7)
				date = new Date()
				if (date.getMonth() + 1 == parseInt(releaseMonth) || parseInt(releaseMonth) == date.getMonth()) {
					index += 1
					medium.id = list[i].id
					media.push(medium)
				}
			}
		}else {break}
	}
}

function getTrendingMoviesDetails(mediaList) {
	let movieNo = 0
	for (let i=0; i<mediaList.length; i++){
		if (mediaList[i].type == "movie") {
			fetch(`https://api.themoviedb.org/3/movie/${mediaList[i].id}?api_key=${key}&language=en-US&append_to_response=videos,release_dates`)
			.then(response => response.json())
			.then(response => {trendingMoviesDetails.push(response); updateTrendingMovies(trendingMoviesDetails, movieNo); movieNo += 1})
		}else if (mediaList[i].type == "tv") {	
			fetch(`https://api.themoviedb.org/3/tv/${mediaList[i].id}?api_key=${key}&language=en-US&append_to_response=videos,release_dates`)
			.then(response => response.json())
			.then(response => {trendingMoviesDetails.push(response); updateTrendingMovies(trendingMoviesDetails, movieNo); movieNo += 1})	
		}
	}
}

function updateTrendingMovies(details, i) {
	movieName = trendingMovies[i].querySelector("#movie-name")
	movieImage = trendingMovies[i].querySelector("img")
	genres = trendingMovies[i].querySelector("#genres")
	overview = trendingMovies[i].querySelector("#overview")
	certification = trendingMovies[i].querySelector("#certification")
	runTime = trendingMovies[i].querySelector("#run-time")
	if (details[i].original_name) {
		movieName.textContent = details[i].original_name
	}else {
		movieName.textContent = details[i].original_title
		//certification.textContent = details[i].release_dates[41].release_dates[0].certification
	}
	movieImage.src = `https://image.tmdb.org/t/p/w1280${details[i].backdrop_path}`
	// genres = 
	overview.textContent = details[i].overview
	runTime.textContent = `Run Time: ${details[i].runtime} min`
}

fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${key}`)
	.then(response => response.json())
	.then(response => {getTrendingMovies(response.results); getTrendingMoviesDetails(media)})

let sectionNamesContainer = document.getElementById("section-names")
let sectionNames = Array.from(sectionNamesContainer.querySelectorAll("div"))
let sections = document.querySelectorAll('.sections')
sections = Array.from(sections)
let mostPopular = []

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
		sections[newIndex].style.display = 'flex'
	}else {
		sections[newIndex].style.display = 'block'
	}
}


closeBtn = document.getElementById("close-btn")
clickedMovieDetails = document.getElementById("clicked-movie-details")
movies = document.querySelectorAll(".movie-container")

function showFullDetails() {
	clickedMovieDetails.style.right = "10px"
}

function closeFullDetails() {
	clickedMovieDetails.style.right = "-24%"
}

for (let i=0; i<movies.length; i++) {
	movies[i].addEventListener("click", showFullDetails)
}

closeBtn.addEventListener("click", closeFullDetails)


// fetch(`https://api.themoviedb.org/3/movie/406759?api_key=${key}&language=en-US&append_to_response=videos,release_dates`)
// 	.then(response => response.json())
// 	.then(response => console.log(response))

// fetch('https://api.themoviedb.org/3/movie/popular?api_key=${key}', {
// 	method: 'GET',
// 	headers: {'Authorization': 'Bearer ${key}'}
// }).then(res => res.json())
//   .then(res => console.log(res))

// fetch('https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=1', {
// 	method: 'GET',
// 	headers: {'Authorization': 'Bearer ${key}'}}
// ).then(res => res.json())
//   .then(res => console.log(res))

//https://api.themoviedb.org/3/tv/{tv_id}?api_key=${key}&language=en-US130392

// backdrop_path: "/64a8imymtJ4WOzIeyUHLtZnJ3wv.jpg"
// first_air_date: "2022-03-30"
// genre_ids: (4) [10759, 10765, 9648, 18]
// id: 92749
// media_type: "tv"
// name: "Moon Knight"
// origin_country: ['US']
// original_language: "en"
// original_name: "Moon Knight"
// overview: "When Steven Grant, a mild-mannered gift-shop employee, becomes plagued with blackouts and memories of another life, he discovers he has dissociative identity disorder and shares a body with mercenary Marc Spector. As Steven/Marc’s enemies converge upon them, they must navigate their complex identities while thrust into a deadly mystery among the powerful gods of Egypt."
// popularity: 523.123
// poster_path: "/zQSABH2Dza4mXLow2f0V2IQvJOL.jpg"
// vote_average: 8.4
// vote_count: 65
// [[Prototype]]: Object
// 1:
// adult: false
// backdrop_path: "/lRbDyjI7HEaXxflFQbYpqHRGFBJ.jpg"
// genre_ids: (4) [80, 18, 9648, 53]
// id: 505026
// media_type: "movie"
// original_language: "en"
// original_title: "Death on the Nile"
// overview: "Belgian sleuth Hercule Poirot boards a glamorous river steamer with enough champagne to fill the Nile. But his Egyptian vacation turns into a thrilling search for a murderer when a picture-perfect couple’s idyllic honeymoon is tragically cut short."
// popularity: 1152.285
// poster_path: "/kVr5zIAFSPRQ57Y1zE7KzmhzdMQ.jpg"
// release_date: "2022-02-09"
// title: "Death on the Nile"
// video: false
// vote_average: 6.6
// vote_count: 804

//search-syntax: https://api.themoviedb.org/3/search/movie?api_key=${key}&query=deadpool&page=1
//img-syntax: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg'

// 41:
// iso_3166_1: "US"
// release_dates: Array(3)
// 0: {certification: 'PG', iso_639_1: '', note: '', release_date: '2013-03-22T00:00:00.000Z', type: 3}
// 1: {certification: 'PG', iso_639_1: '', note: 'DVD, Blu-ray', release_date: '2013-10-01T00:00:00.000Z', type: 5}
// 2: {certification: 'PG', iso_639_1: '', note: '4K UHD', release_date: '2020-11-17T00:00:00.000Z', type: 5}



// <div id="clicked-movie-details">
// 		<span id="close-btn">close</span>
// 		<img src="shoe 2.jpg">
// 		<div id="clicked-movie-txt">
// 			<div id="name-nd-genres">
// 				<h2>Tired Shoe</h2>
// 				<span>Sport</span>
// 				<span>Adventure</span>
// 				<span>Calories</span>
// 			</div>
// 			<div>Run-Time: </div>
// 			<div>Release Date: </div>
// 			<div id="clicked-movie-ratings">
// 				<div>
// 					<h2>90%</h2>
// 					Rotten Tomatoes
// 				</div>
// 				<div>
// 					<h2>8.1</h2>
// 					IMDB
// 				</div>
// 			</div>
// 			<div id="plot">
// 				<h3>Plot :</h3>
// 				Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
// 				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
// 				quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
// 				consequat.
// 			</div>
// 			<a href="#" id="trailer-link">Watch Trailer</a>
// 		</div>
// 	</div>


// fetch('https://data-imdb1.p.rapidapi.com/titles/search/keyword/deadpool', {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Host': 'data-imdb1.p.rapidapi.com',
//     	'X-RapidAPI-Key': '2d39e8dc5dmshb63147aa42b6c97p127e1bjsnf94f3a9f0c41'
// 	}
// })
// 	.then(res => res.json())
// 	.then(res => console.log(res))