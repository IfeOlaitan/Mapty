'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map, mapEvent;

// class App {
//     constructor()


// }

//Get Loaction
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        //Get position
        function (position) {
            //console.log(position.coords);
            const { latitude } = position.coords;
            const { longitude } = position.coords;
            //console.log(`https://www.google.com/maps/@${latitude},${longitude},12z`);

            const coords = [latitude, longitude];
            
            //Leaflet
            map = L.map('map').setView(coords, 13);
            //console.log(map);

            //Tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            
            //Event listener for clicks on map
            map.on('click', function (mapE) {
                mapEvent = mapE;
                form.classList.remove('hidden');
                inputDistance.focus();
            });
        },

        //Error message
        function () {
            alert('Could not get your location');
        }
    )
}


//Event Listener for form
form.addEventListener('submit', function (e) {
    e.preventDefault();

    //Clear input fields
    inputDuration.value = inputDistance.value = inputCadence.value = inputElevation.value = '';

    console.log(mapEvent.latlng);
    const { lat, lng } = mapEvent.latlng;

    //*Create marker after cliking on a point 
    L.marker([lat, lng]) //creates a marker
    .addTo(map) //adds the marker to the map
    .bindPopup(L.popup({
        maxwidth: 250,
        minwidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup'
    })) //creates a popup and binds it to the marker
    .setPopupContent('Workout') //Set content for popup
    .openPopup(); //open popup
});

//Event Listener to toggle btw input cadence and input elevation
inputType.addEventListener('change', function () {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');

    //console.log(inputElevation.closest('.form__row'));
});