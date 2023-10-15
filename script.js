const url = "https://rickandmortyapi.com/api"; 

const loadEpisodes = async () => {
    const response = await fetch("https://rickandmortyapi.com/api/episode")
        return response.json();
};

async function loadCharacter() {
    const response = await fetch("https://rickandmortyapi.com/api/character")
        return response.json();
}

async function loadLocations() {
    const response = await fetch("https://rickandmortyapi.com/api/location")
        return response.json();
}

{/* <div class="flex items-center justify-center mt-40" id="container">
        <div class="w-[304px] h-[304px] absolute bg-white rounded-[10px]  mt-40" id="card-episode">
            <div class="w-[304px] h-[304px] w-2/4">
                <img src="./images/Image-RickyAndMorty.jpg" class="rounded-tl-[10px] rounded-tr-[10px]" alt="">
            </div>
            <div class="relative -top-[134px] flex flex-col items-center justify-center">
                <h1 class="text-[30px] font-bold">
                    Name: Pilot
                </h1>
                <h2 class="text-[30px] font-bold">
                    Episode: S01E01
                </h2>
            </div>
        </div>
</div> */}

const card = () => {

    const container = document.createElement("div");
    container.classList.add("flex", "items-center", "justify-center", "mt-40")


    const cardEpisode = document.createElement("div");
    cardEpisode.classList.add("w-[304px]", "h-[304px]", "absolute", "bg-white", "rounded-[10px]", "mt-40");
    container.appendChild(cardEpisode);

    const divImage = document.createElement("div");
    divImage.classList.add("w-[304px]", "h-[304px]", "w-2/4");
    cardEpisode.appendChild(divImage);

    const image = document.createElement("img");
    image.src = "./images/Image-RickyAndMorty.jpg";
    image.classList.add("rounded-tl-[10px]", "rounded-tr-[10px]")
    divImage.appendChild(image)

    const divTexts = document.createElement("div");
    divTexts.classList.add("relative", "-top-[134px]", "flex", "flex-col", "items-center", "justify-center");
    cardEpisode.appendChild(divTexts);

    const title = document.createElement("h1");
    title.innerText = "Name: Pilot";
    title.classList.add("text-[30px]", "font-bold");
    divTexts.appendChild(title); 

    const subTitle = document.createElement("h2");
    title.innerText = "Episode: S01E01";
    title.classList.add("text-[30px]", "font-bold");
    divTexts.appendChild(subTitle);


}



async function getALL() {
    const [response, response2, response3] = await Promise.all([ loadEpisodes(), loadCharacter(), loadLocations() ])
    
    console.log(response, response2, response3);

}

card()
getALL(); 