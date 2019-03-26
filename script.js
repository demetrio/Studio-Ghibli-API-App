"use strict";
const myRequest = new Request('https://ghibliapi.herokuapp.com/films');
const mainContainer = document.getElementById('container');

fetch(myRequest)
    .then(function (response) {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('Something went wrong on api server!');
        }
    })
    .then(function (response) {
        response.forEach(movie => {
            const card = document.createElement('div');
            card.setAttribute('class', 'card');
            card.setAttribute('data-id', movie.id);

            const h1 = document.createElement('h1');
            h1.textContent = movie.title;

            const p = document.createElement('p');
            movie.description = movie.description.substring(0, 150);
            p.textContent = `${movie.description}...`;

            mainContainer.appendChild(card);
            card.appendChild(h1);
            card.appendChild(p);
        });
    })
    .catch(error => {
        console.log.error(error);
    });

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
    mainContainer.innerHTML = ""
    search.parentNode.removeChild(search);

    getMovie(element);
}

function getMovie(element) {
    fetch(new Request("https://ghibliapi.herokuapp.com/films/" + element))
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Something went wrong on api server!');
            }
        })
        .then(function (response) {
            const card = document.createElement('div');
            
            card.setAttribute('class', 'card--show');
            card.setAttribute('data-id', response.id);

            const title = document.createElement('h1');
            title.textContent = response.title;

            const description = document.createElement('p');
            description.textContent = response.description;

            const staff = document.createElement('p');
            staff.setAttribute('id', 'staff');
            staff.textContent = `Directed by ${response.director} Produced by ${response.producer}`;

            const releaseDate = document.createElement('p');
            releaseDate.setAttribute('id', 'releaseDate');
            releaseDate.textContent = `Release date ${response.release_date}`;

            const rtScore = document.createElement('p');
            rtScore.setAttribute('id', 'score');
            rtScore.textContent = `${response.rt_score}/100`;

            mainContainer.appendChild(card);
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(staff);
            card.appendChild(releaseDate);
            card.appendChild(rtScore);
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
 *  Borrar el div que contiene todo y volver a crear la nueva pagina.
 */