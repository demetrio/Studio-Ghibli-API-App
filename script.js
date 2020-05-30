"use strict";

const myRequest = new Request('https://ghibliapi.herokuapp.com/films');
const mainContainer = document.getElementById('container');
const ghibliLogo = document.getElementById('logoGhibli');

const ghibliData = [];

async function fetchMovieList(request) {
    try {
        const res = await fetch(request);
        const data  = await res.json()
        return data;
    }catch(err){
        throw new Error('Something went wrong on api server!');
    }
};

async function renderInfo(){

    if(!ghibliData.length){
         ghibliData.push(... await fetchMovieList(myRequest));
    }

    ghibliData.forEach(movie => {
        createCard(movie, false);
    });
}

renderInfo();

function createCard(movie, show) {

    const card = document.createElement('div');
    card.setAttribute('data-id', movie.id);

    const title = document.createElement('h1');
    title.textContent = movie.title;
    card.appendChild(title);

    const description = document.createElement('p');
    card.appendChild(description);

    if (show) {
        card.setAttribute('class', 'card--show');
        description.textContent = movie.description;

        const staff = document.createElement('p');
        staff.setAttribute('id', 'staff');
        staff.textContent = `Directed by ${movie.director} Produced by ${movie.producer}`;

        const releaseDate = document.createElement('p');
        releaseDate.setAttribute('id', 'releaseDate');
        releaseDate.textContent = `Release date ${movie.release_date}`;

        const rtScore = document.createElement('p');
        rtScore.setAttribute('id', 'score');
        rtScore.textContent = `${movie.rt_score}/100`;

        card.appendChild(staff);
        card.appendChild(releaseDate);
        card.appendChild(rtScore);
    } else {
        card.setAttribute('class', 'card');

        movie.description = movie.description.substring(0, 150);
        description.textContent = `${movie.description}...`; 
    }
    mainContainer.appendChild(card);
}

function filter(searchedTitle) {
    searchedTitle = searchedTitle.toLowerCase();
    const cards = document.querySelectorAll('.card');
    //console.log(search);
    cards.forEach(card => {
        const title = card.querySelector('h1').innerText.toLowerCase();
        //console.log(title);
        card.style.display = title.match(searchedTitle) ? "block" : "none";
    });
}

const search = document.querySelector('.search-bar');

search.addEventListener("keyup", function (event) {
    filter(event.target.value);
});


function show(element) {
    mainContainer.innerHTML = "";
    search.style.display = "none";
    renderMovie(element);
    comeBack();
}

function comeBack() {

    ghibliLogo.setAttribute('id', 'go--back');
  
    ghibliLogo.addEventListener("click", () => {
        mainContainer.innerHTML = "";
        search.style.display = "block";
        renderInfo();
    });
}

async function renderMovie(element) {

    try {
        const res = await fetch(new Request("https://ghibliapi.herokuapp.com/films/" + element));
        const data  = await res.json()
        createCard(data, true);
    }catch(err){
        throw new Error('Something went wrong on api server!');
    }

}

mainContainer.addEventListener("click", function (event) {
    const card = event.target.closest('.card');
    if (card === null) {
        return;
    }
    show(card.getAttribute('data-id'));
});
