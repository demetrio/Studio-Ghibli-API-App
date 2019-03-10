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

            const h1 = document.createElement('h1');
            h1.textContent = movie.title;

            const p = document.createElement('p');
            movie.description = movie.description.substring(0, 300);
            p.textContent = `${movie.description}...`;

            mainContainer.appendChild(card);
            card.appendChild(h1);
            card.appendChild(p);
        });
    })
    .catch(error => {
        console.error(error);
    });


function filter(titleSearched) {
    const cards = document.querySelectorAll('.card');
    search = titleSearched.toLowerCase();
    console.log(search);
    cards.forEach(card => {
        let title = card.querySelector('h1').innerText.toLowerCase();
        console.log(title);
        card.style.display = title.match(search) ? "block" : "none";
    });
}

/**
 *  Borrar el div que contiene todo y volver a crear la nueva pagina.
 */