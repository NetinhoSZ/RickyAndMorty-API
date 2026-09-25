const charsContainer = document.querySelector("#chars-container"); 
const searchInput = document.querySelector("#search");
const speciesFilter = document.querySelector("#species");
const genderFilter = document.querySelector("#gender");
const statusFilter = document.querySelector("#status");
const loadMoreButton = document.querySelector("#load-more"); 

const epContainer = document.querySelector("#ep-container");

const api = "https://rickandmortyapi.com/api"; 

const defaultFilters = {
    name: '',
    species: '',
    gender: '',
    status: '',
    page: 1

}

const filter = {
    name: '',
    episode: '',
    page: 1
}

async function getCharacters({name, species, gender, status, page = 1}) {
    const response = await fetch(`${api}/character?name=${name}&species=${species}&gender=${gender}&status=${status}&page=${page}`); 

    const characters = await response.json(); 

    console.log(characters.results)

    return characters.results;
} 

async function getEpisodes({name, episode, page = 1 }) {
    const response = await fetch(`${api}/episode?name=${name}&episode=${episode}&page=${page}`);

    const episodes = await response.json();

    console.log(episodes.results)

    return episodes.results;
}


const statusLabel = {
    alive: 'Vivo',
    dead: 'Morto',
    unknown: 'Desconhecido'
}

const statusDot = {
    alive: 'bg-emerald-500',
    dead: 'bg-red-500',
    unknown: 'bg-zinc-400'
}

const genderLabel = {
    male: 'Masculino',
    female: 'Feminino',
    genderless: 'Sem gênero',
    unknown: 'Desconhecido'
}

const pinIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 shrink-0 text-emerald-600"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.847 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>`

async function render({characters, episodes}) {
    characters.map((character) => {

        const status = (character.status || '').toLowerCase();
        const alive = status === 'alive';

        return charsContainer.innerHTML += `
            <div class="group w-[260px] bg-white rounded-2xl shadow-[0_8px_24px_-10px_rgba(16,185,129,0.35)] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-10px_rgba(16,185,129,0.45)]">
                <div class="relative overflow-hidden">
                    <img src="${character.image}" alt="${character.name}" class="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105">
                </div>
                <div class="char-info p-4">
                    <h3 class="text-lg font-bold leading-tight truncate">${character.name}</h3>
                    <p class="text-sm text-zinc-500 pb-1">${character.species}${character.type ? ` (${character.type})` : ''} · ${genderLabel[character.gender] ?? character.gender}</p>
                    <p class="flex items-center gap-1.5 text-xs font-medium pb-3 ${alive ? 'text-emerald-600' : 'text-zinc-500'}">
                        <span class="relative flex h-2 w-2">
                            ${alive ? '<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>' : ''}
                            <span class="relative inline-flex h-2 w-2 rounded-full ${statusDot[status] ?? 'bg-zinc-400'}"></span>
                        </span>
                        ${statusLabel[status] ?? character.status}
                    </p>

                    <div class="space-y-1.5 text-xs text-zinc-600 border-t border-zinc-100 pt-3">
                        <p class="flex items-center gap-1.5">${pinIcon}<span><span class="font-semibold text-zinc-800">Atual:</span> ${character.location?.name || 'Desconhecida'}</span></p>
                        <p class="flex items-center gap-1.5">${pinIcon}<span><span class="font-semibold text-zinc-800">Origem:</span> ${character.origin?.name || 'Desconhecida'}</span></p>
                    </div>
                </div>
            </div>
        `

    });

    episodes.map((episode) => {

        return epContainer.innerHTML += `
        <div class="w-[304px] h-[304px] absolute bg-white rounded-[10px] mt-40" id="card-episode">
            <div class="relative -top-[134px] flex flex-col items-center justify-center">
                <h1 class="text-[30px] font-bold">
                    ${episode.name}
                </h1>
                <h2 class="text-[30px] font-bold">
                    ${episode.episode}
                </h2>
            </div>
        </div>
        `
    });
}

function handleFilterChange(type, event){
    return async () => {
        defaultFilters[type] = event.target.value;
        charsContainer.innerHTML = '';
        const characters = await getCharacters(defaultFilters)
        render({ characters})
    }
} 

async function handleLoadMore() {
    defaultFilters.page += 1
    const characters = await getCharacters(defaultFilters)
    render({ characters })   
}

function addListeners() {
    speciesFilter.addEventListener('change', async (event) => {
        handleFilterChange("species", event)()
    })
    
    genderFilter.addEventListener('change', async (event) => {
        handleFilterChange("gender", event)()
    } ) 
    
    statusFilter.addEventListener('change', async (event) => {
        handleFilterChange("status", event)()
    }) 
    
    searchInput.addEventListener('keyup', async (event) => {
        handleFilterChange("name", event)()
    
    }) 
    
    loadMoreButton.addEventListener('click', handleLoadMore)
}

async function main() {

    const characters = await getCharacters(defaultFilters);
    const episodes = await getEpisodes(filter)
    addListeners();
    render({ characters, episodes });
    

}

main()


// const loadEpisodes = async () => {
//     const response = await fetch("https://rickandmortyapi.com/api/episode")
//         return response.json();
// };

// async function loadCharacter() {
//     const response = await fetch("https://rickandmortyapi.com/api/character")
//         return response.json();
// }

// async function loadLocations() {
//     const response = await fetch("https://rickandmortyapi.com/api/location")
//         return response.json();
// }

// const createCard = (response) => {

//     response.forEach(element => {
//         card(element.name);
//     });
// }

// const card = (name) => { 

//     const div = document.getElementById("div");
//     const divContainer = document.createElement("div");

//     const container = document.createElement("div");
//     container.classList.add("flex", "items-center", "justify-center", "mt-40");

//     const cardEpisode = document.createElement("div");
//     cardEpisode.classList.add("w-[304px]", "h-[304px]", "absolute", "bg-white", "rounded-[10px]", "mt-40");
//     container.appendChild(cardEpisode);

//     const divImage = document.createElement("div");
//     divImage.classList.add("w-[304px]", "h-[304px]", "w-2/4");
//     cardEpisode.appendChild(divImage);

//     const image = document.createElement("img");
//     image.src = "./images/Image-RickyAndMorty.jpg";
//     image.classList.add("rounded-tl-[10px]", "rounded-tr-[10px]")
//     divImage.appendChild(image)

//     const divTexts = document.createElement("div");
//     divTexts.classList.add("relative", "-top-[134px]", "flex", "flex-col", "items-center", "justify-center");
//     cardEpisode.appendChild(divTexts);

//     const title = document.createElement("h1");
//     title.innerText = "name:" + name;
//     title.classList.add("text-[30px]", "font-bold");
//     divTexts.appendChild(title); 

//     const subTitle = document.createElement("h2");
//     title.innerText = "Episode: S01E01";
//     title.classList.add("text-[30px]", "font-bold");
//     divTexts.appendChild(subTitle);

// }



// async function getALL() {
//     const [response, response2, response3] = await Promise.all([ loadEpisodes(), loadCharacter(), loadLocations() ])
    
//     console.log(response, response2, response3);
//     // createCard(response.results);
// }

// card();
// getALL(); 