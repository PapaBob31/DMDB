let sectionNamesContainer = document.getElementById("section-names")
let sectionNames = Array.from(sectionNamesContainer.querySelectorAll("div"))
let sections = document.querySelectorAll('.sections')
sections = Array.from(sections)

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
		sections[newIndex].style.display = 'initial'
	}
}



// fetch('https://data-imdb1.p.rapidapi.com/titles/search/keyword/deadpool', {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Host': 'data-imdb1.p.rapidapi.com',
//     	'X-RapidAPI-Key': '2d39e8dc5dmshb63147aa42b6c97p127e1bjsnf94f3a9f0c41'
// 	}
// })
// 	.then(res => res.json())
// 	.then(res => console.log(res))