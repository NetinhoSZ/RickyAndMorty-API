const charsContainer = document.querySelector("#chars-container"); 
const searchInput = document.querySelector("#search");
const speciesFilter = document.querySelector("#species");
const genderFilter = document.querySelector("#gender");
const statusFilter = document.querySelector("#status");
const loadMoreButton = document.querySelector("#load-more"); 

const epContainer = document.querySelector("#ep-container");
const seasonFilter = document.querySelector("#season");
const episodeFilter = document.querySelector("#episode");

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

const CHARACTERS_PER_LOAD = 40;
const PAGE_SIZE = 20;
const PAGES_PER_LOAD = CHARACTERS_PER_LOAD / PAGE_SIZE;

async function getCharacters({name, species, gender, status, page = 1}) {
    const pages = await Promise.all(
        Array.from({ length: PAGES_PER_LOAD }, (_, i) =>
            fetch(`${api}/character?name=${name}&species=${species}&gender=${gender}&status=${status}&page=${page + i}`)
        )
    );

    const results = await Promise.all(
        pages.map(async (response) => response.ok ? (await response.json()).results ?? [] : [])
    );

    const characters = results.flat();

    console.log(characters)

    return characters;
}

async function getEpisodes({name, episode, page = 1 }) {
    const response = await fetch(`${api}/episode?name=${name}&episode=${episode}&page=${page}`);

    const episodes = await response.json();

    return episodes;
}

async function getAllEpisodes() {
    // Pega o total de episódios e busca todos de uma vez pelos ids, sem depender da paginação
    const { info } = await getEpisodes(filter);
    const ids = Array.from({ length: info.count }, (_, i) => i + 1).join(',');
    const response = await fetch(`${api}/episode/${ids}`);
    const episodes = await response.json();

    return [].concat(episodes).sort((a, b) => a.id - b.id);
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

async function render({characters = [], episodes = []}) {
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

    if (epContainer) initEpisodeFilters(episodes);
}

let allEpisodes = [];

function seasonOf(episode) {
    return Number(episode.episode.slice(1, 3));
}

function initEpisodeFilters(episodes) {
    allEpisodes = episodes;

    const seasons = [...new Set(episodes.map(seasonOf))];
    seasonFilter.innerHTML = seasons.map((season) => `<option value="${season}">Temporada ${season}</option>`).join('');

    seasonFilter.addEventListener('change', () => selectSeason(Number(seasonFilter.value)));
    episodeFilter.addEventListener('change', () => showEpisodes(Number(seasonFilter.value), episodeFilter.value));

    selectSeason(seasons[0]);
}

function selectSeason(season) {
    const list = allEpisodes.filter((episode) => seasonOf(episode) === season);

    episodeFilter.innerHTML = '<option value="">Todos os episódios</option>'
        + list.map((episode) => `<option value="${episode.episode}">${episode.episode} - ${episode.name}</option>`).join('');

    showEpisodes(season, '');
}

function showEpisodes(season, code) {
    const list = allEpisodes.filter((episode) => seasonOf(episode) === season && (!code || episode.episode === code));

    epContainer.innerHTML = list.map(episodeCard).join('');
}

function episodeCard(episode) {
    const summary = (typeof EPISODE_SUMMARIES !== 'undefined' && EPISODE_SUMMARIES[episode.episode])
        || 'Resumo ainda não disponível.';
    // Imagem do episódio: avatar de um dos personagens que aparecem nele
    const characterId = episode.characters[episode.characters.length - 1].split('/').pop();

    return `
        <div class="bg-white p-2 rounded-lg w-[300px] h-[490px] flex flex-col">
            <img src="${api}/character/avatar/${characterId}.jpeg" alt="${episode.name}" loading="lazy" class="rounded-lg mb-2 w-full h-[200px] object-cover">
            <div class="char-info">
                <h3 class="text-[20px] font-bold pb-[2px] leading-tight line-clamp-2 min-h-[50px]">${episode.name}</h3>
                <span class="text-[20px] block">${episode.episode}</span>
                <span class="text-[16px] block">${episode.air_date}</span>
            </div>
            <div class="mt-auto">
                <button type="button" data-toggle class="w-full flex items-center justify-between font-semibold hover:text-emerald-600">
                    <span>Resumo</span>
                    <span class="chevron transition-transform duration-300">▼</span>
                </button>
                <div class="dropdown grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-in-out">
                    <div class="overflow-hidden">
                        <p class="mt-1 text-[15px] max-h-[120px] overflow-y-auto">${summary}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function addDropdownListener() {
    epContainer.addEventListener('click', (event) => {
        const button = event.target.closest('[data-toggle]');
        if (!button) return;

        const panel = button.nextElementSibling;
        const open = panel.classList.toggle('grid-rows-[1fr]');
        panel.classList.toggle('grid-rows-[0fr]', !open);
        button.querySelector('.chevron').classList.toggle('rotate-180', open);
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
    defaultFilters.page += PAGES_PER_LOAD
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

// Dropdown customizado no lugar do <select> nativo, para poder animar a abertura e o fechamento.
// O <select> original continua no DOM (escondido) e dispara "change" normalmente.
function enhanceSelect(select) {
    const width = select.className.match(/w-\[\d+px\]/)?.[0] ?? 'w-[200px]';
    const wrapper = document.createElement('div');
    wrapper.className = `relative ${width}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-zinc-300 bg-white outline-none text-start transition-colors hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30';
    button.innerHTML = '<span class="label truncate"></span><span class="chevron text-xs transition-transform duration-300">▼</span>';

    const panel = document.createElement('div');
    panel.className = 'absolute z-20 left-0 right-0 top-full mt-1 grid grid-rows-[0fr] opacity-0 pointer-events-none transition-[grid-template-rows,opacity] duration-300 ease-in-out';
    panel.innerHTML = '<div class="overflow-hidden"><ul class="options max-h-60 overflow-y-auto bg-white rounded-lg border border-zinc-200 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.35)] py-1"></ul></div>';

    wrapper.append(button, panel);
    select.classList.add('hidden');
    select.after(wrapper);

    const list = panel.querySelector('.options');
    const label = button.querySelector('.label');
    const chevron = button.querySelector('.chevron');

    function setOpen(open) {
        panel.classList.toggle('grid-rows-[1fr]', open);
        panel.classList.toggle('grid-rows-[0fr]', !open);
        panel.classList.toggle('opacity-100', open);
        panel.classList.toggle('opacity-0', !open);
        panel.classList.toggle('pointer-events-auto', open);
        panel.classList.toggle('pointer-events-none', !open);
        chevron.classList.toggle('rotate-180', open);
    }

    function sync() {
        label.textContent = select.selectedOptions[0]?.textContent ?? '';
        list.innerHTML = '';
        [...select.options].forEach((option) => {
            const item = document.createElement('li');
            const selected = option.value === select.value;
            item.textContent = option.textContent;
            item.className = `px-3 py-2 cursor-pointer transition-colors hover:bg-emerald-50 ${selected ? 'font-semibold text-emerald-600' : ''}`;
            item.addEventListener('click', () => {
                select.value = option.value;
                select.dispatchEvent(new Event('change'));
                sync();
                setOpen(false);
            });
            list.appendChild(item);
        });
    }

    button.addEventListener('click', () => setOpen(!panel.classList.contains('opacity-100')));
    document.addEventListener('click', (event) => { if (!wrapper.contains(event.target)) setOpen(false); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
    new MutationObserver(sync).observe(select, { childList: true });

    sync();
}
async function main() {

    document.querySelectorAll("select").forEach(enhanceSelect);


    if (charsContainer) {
        const characters = await getCharacters(defaultFilters);
        addListeners();
        render({ characters });
    }

    if (epContainer) {
        addDropdownListener();
        const episodes = await getAllEpisodes();
        render({ episodes });
    }


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