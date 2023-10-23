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


async function render({characters, episodes}) {
    characters.map((character) => {
        
        return charsContainer.innerHTML += `
            <div class="bg-white p-2 rounded-lg">
                <img src="${character.image}" alt="" class="rounded-lg pb-2">
                <div class="char-info">
                    <h3 class="text-[20px] font-bold pb-[2px]">${character.name}</h3>
                    <span class="text-[20px]">${character.species}</span>
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