let menuOptionsContainer = document.getElementById("menu-options")
let options = menuOptions.querySelctorAll("a")
options = Array.from(options)
let selectedOption = document.getElementById("selected-option")

for (let i = 0; i < options.length; i++) {
 	options[i].addEventListener("click", changeBackground)
 }

 function changeBackground() {
 	this.id = "selected-option"
 	selectedOption.removeAttribute("id")
 }