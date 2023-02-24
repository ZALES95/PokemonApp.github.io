const searchbar = document.querySelector(".searchbar")
const searchBtn = document.querySelector(".submit")
const errorInfo = document.querySelector(".error-info")
const pokemonName = document.querySelector(".pokemon-name")
const pokemonPicture = document.querySelector(".pokemon-picture")
const pokemonSpecies = document.querySelector(".pokemon-species")
const pokemonType = document.querySelector(".pokemon-type")
const pokemonHp = document.querySelector(".pokemon-hp")
const pokemonAttack = document.querySelector(".pokemon-attack")
const pokemonDefense = document.querySelector(".pokemon-defense")
const pokemonBox = document.querySelector(".pokemon-species")
const statsBtn = document.querySelector(".pokemon-stats")
const previousBtn = document.querySelector(".previous-page")
const nextBtn = document.querySelector(".next-page")
const pagesBox = document.querySelector(".numbers-box")
const allPagesBox = document.querySelector(".all-pages-box")

let allPageNumbers

const pokemonHandle = () => {
	const pokemon = searchbar.value.toLowerCase() || "charizard"
	const URLspecies = `https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`
	const URLpageId = `https://pokeapi.co/api/v2/pokemon/${pokemon}/`

	errorInfo.textContent = ""
	pokemonBox.innerHTML = ""

	getPokemonInfo(URLspecies)
	appendPages(URLpageId)
}

async function getPokemonInfo(link) {
	try {
		const resSpecies = await axios.get(link)
		const responseSpecies = resSpecies.data

		for (const pokemon of responseSpecies.varieties) {
			const currentName = pokemon.pokemon.name
			const URLStats = `https://pokeapi.co/api/v2/pokemon/${currentName}/`

			getPokemonStats(URLStats)
		}
	} catch {
		errorInfo.textContent = "Podaj prawidłową nazwę pokemona"
	}
}

async function getPokemonStats(link) {
	try {
		const resStats = await axios.get(link)
		const responseStats = resStats.data

		createStatsPanel(responseStats)
	} catch {
		errorInfo.textContent = "Podaj prawidłową nazwę pokemona"
	}
}

const createStatsPanel = responseStats => {
	const box = document.createElement("div")
	box.classList.add("pokemon-box")
	box.innerHTML = `<h2 class="pokemon-name">${responseStats.name}</h2>
               <img alt="" class="pokemon-picture" src="${responseStats.sprites.front_default}">
               <button class="pokemon-stats" onclick="handleStats(event)">
                    <p>Statystyki</p>
                    <i class="fa-solid fa-caret-down"></i>
               </button>
               <p class="stat">Gatunek: <span class="pokemon-species">${responseStats.species.name}</span></p>
               <p class="stat">Typ: <span class="pokemon-type">${responseStats.types[0].type.name}</span></p>
               <p class="stat">Hp: <span class="pokemon-hp">${responseStats.stats[0].base_stat}</span></p>
               <p class="stat">Atak: <span class="pokemon-attack">${responseStats.stats[1].base_stat}</span></p>
               <p class="stat">Obrona: <span class="pokemon-defense">${responseStats.stats[2].base_stat}</span></p>`
	pokemonBox.appendChild(box)
}

const handleStats = e => {
	const currentBox = e.target.closest(".pokemon-box")
	const allStats = currentBox.querySelectorAll(".stat")
	let delay = 0

	for (const stat of allStats) {
		if (stat.classList.contains("display-toggle")) {
			stat.classList.toggle("display-toggle")
			stat.classList.toggle("animation-toggle")
		} else {
			setTimeout(() => {
				stat.classList.toggle("display-toggle")
				stat.classList.toggle("animation-toggle")
			}, delay * 1000)
			delay += 0.1
		}
	}
}

async function appendPages(link) {
	try {
		const resPageId = await axios.get(link)
		const pageId = resPageId.data
		searchbar.value = pageId.name
		pagesBox.textContent = ""
		handleNumbersPagination(pageId)
	} catch {
		errorInfo.textContent = "Podaj prawidłową nazwę pokemona"
	}
}

const handleNumbersPagination = pageId => {
	const numbersToDisplay = 7

	let pokemonId = pageId.id
	let index = -3

	for (let i = 0; i < numbersToDisplay; i++) {
		const newNum = document.createElement("button")
		newNum.classList.add("single-page")
		let sum = pokemonId + index

		let tempSum = sum

		if (tempSum <= 0) {
			const loopNumber = tempSum * -1

			for (let j = 0; j < loopNumber + 1; j++) {
				index++
			}
		}

		sum = pokemonId + index

		if (sum > getNumberOfPokemons()) {
			return
		}

		newNum.textContent = sum
		if (index === 0) {
			newNum.classList.add("bg-toggle")
		}
		pagesBox.appendChild(newNum)
		index++
	}
}

async function getNumberOfPokemons() {
	try {
		const resPokemons = await axios.get("https://pokeapi.co/api/v2/pokemon")
		const numberOfPokemons = resPokemons.data.count
		return numberOfPokemons
	} catch {
		errorInfo.textContent = "Podaj prawidłową nazwę pokemona"
	}
}

const handlePageClick = e => {
	if (e.target.classList.contains("single-page")) {
		const newId = parseInt(e.target.textContent)
		searchbar.value = newId
	} else if (e.target.classList.contains("previous-page")) {
		let newId = parseInt(pagesBox.querySelector(".bg-toggle").textContent)
		if (newId !== 1) {
			newId--
		}
		searchbar.value = newId
	} else if (e.target.classList.contains("next-page")) {
		let newId = parseInt(pagesBox.querySelector(".bg-toggle").textContent)
		newId++
		searchbar.value = newId
	}

	pokemonHandle()
}

const enterKeyCheck = e => {
	if (e.key === "Enter") {
		pokemonHandle()
	}
}

searchBtn.addEventListener("click", pokemonHandle)
searchbar.addEventListener("keyup", enterKeyCheck)
allPagesBox.addEventListener("click", handlePageClick)

pokemonHandle()
