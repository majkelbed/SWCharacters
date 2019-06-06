window.onload = () => {
    const app = document.getElementById('app');
    const data = [1, 10, 20];
    initializePage(data, app);

    app.addEventListener('click', resetCharacter);
}

function initializePage(data, app) {
    data.forEach(id => {
        const div = document.createElement('div');
        div.classList.add('character');
        app.appendChild(div);
        injectCharacter(id, div);
    });
}

async function fetchCharacter(id) {
    const response = await fetch(`https://swapi.co/api/people/${id}`);
    if (response.status > 400 && response.status < 600) {
        throw new Error('Bad response from server');
    }
    const char = await response.json();
    return await char;
}


async function fetchFilm(url) {
    const response = await fetch(`${url}`);

    if (response.status > 400 && response.status < 600) {
        throw new Error('Bad response from server');
    }
    const film = await response.json();
    return await film;
}

async function injectCharacter(id, root) {
    root.classList.add('character_fetching');
    const char = await fetchCharacter(id);
    root.classList.remove('character_fetching');
    root.innerHTML = `<h2 class="character_name">Name: ${char.name}</h2>
                         <h2 class="character_height">Height: ${char.height}</h2>
                         <h2 class="character_mass">Mass: ${char.mass}</h2>
                         <h2 class="character_color--hair">Hair color: ${char.hair_color}</h2>
                         <h2 class="character_color--skin">Skin color: ${char.skin_color}</h2>`;
    injectFilms(char.films, root);
}

async function injectFilms(films, root) {
    let injection = `<h2 class="character_films">Films:</h2>`;
    for (let film of films) {
        const id = film.slice(film.length - 2, film.length - 1);
        if (localStorage.getItem(`SW_film_${id}`) === null) {
            localStorage.setItem(`SW_film_${id}`, JSON.stringify(await fetchFilm(film)));
        }
        injection += `<h2 class="character_films">${JSON.parse(localStorage.getItem(`SW_film_${id}`)).title}</h2>`;
    }
    root.innerHTML += injection;
}

function resetCharacter(e) {
    let id = Math.ceil(Math.random() * 70);
    const parent = e.target.parentElement;

    if (!parent.classList.contains('character')) {
        injectCharacter(id, e.target);
    }
    else if (e.target.classList.contains('character_films--button')) {
        return;// injectFilm(, e.target.parentElement);
    }
    else {
        injectCharacter(id, parent);
    }
}

