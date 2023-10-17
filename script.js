const url = "https://rickandmortyapi.com/api"; 

const container = document.querySelector("#container"); 

async function getData({name, episode, page = 1}) {
    const response = await fetch(`${url}/episode?name=${name}&episode=${episode}&page=${page}`); 

    const episodes = await response.json(); 

    console.log(episodes.results)

    return episodes.results;
}

getData();

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