"use strict";
const myRequest = new Request('https://ghibliapi.herokuapp.com/films');
const mainContainer = document.getElementById('container');
const ghibliLogo = document.getElementById('logoGhibli');

function fetchMovieList(request) {
    fetch(request)
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Something went wrong on api server!');
            }
        })
        .then(function (response) {
            response.forEach(movie => {
                createCard(movie, false);
            });
        })
        .catch(error => {
            console.log.error(error);
        });
};

fetchMovieList(myRequest);

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
        fetchMovieList(myRequest);
    });
}

function renderMovie(element) {
    fetch(new Request("https://ghibliapi.herokuapp.com/films/" + element))
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Something went wrong on api server!');
            }
        })
        .then(function (response) {
            createCard(response, true);
        });
}

mainContainer.addEventListener("click", function (event) {
    const card = event.target.closest('.card');
    if (card === null) {
        return;
    }
    show(card.getAttribute('data-id'));
});



/*
    Borrar el div que contiene todo y volver a crear la nueva pagina.
    Create class called hidden, add or remove it.
 */
