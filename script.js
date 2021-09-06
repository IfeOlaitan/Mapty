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

class App {
    #map;
    #mapEvent;

    constructor() {
        this._getPosition();
        
        //*Event Listeners
        //Event Listener for form
        form.addEventListener('submit', this._newWorkout.bind(this));
        //Event Listener to toggle btw input cadence and input elevation
        inputType.addEventListener('change', this._toggleElevationField.bind(this));
    }
    
    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert('Could not get your location');
            });
        }
    }

    _loadMap(position) {
        //console.log(position.coords);
        const { latitude } = position.coords;
        const { longitude } = position.coords;

        const coords = [latitude, longitude];
    
        //Leaflet
        console.log(this);
        this.#map = L.map('map').setView(coords, 13);
        //console.log(map);

        //Tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

    
        //Event listener for clicks on map
        this.#map.on('click', this._showForm.bind(this));
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e) {
        e.preventDefault();

        //Clear input fields
        inputDuration.value = inputDistance.value = inputCadence.value = inputElevation.value = '';

        //console.log(mapEvent.latlng);
        const { lat, lng } = this.#mapEvent.latlng;

        //*Create marker after cliking on a point 
        L.marker([lat, lng]) //creates a marker
            .addTo(this.#map) //adds the marker to the map
            .bindPopup(L.popup({
                maxwidth: 250,
                minwidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: 'running-popup'
            })) //creates a popup and binds it to the marker
            .setPopupContent('Workout') //Set content for popup
            .openPopup(); //open popup
    }
}

const app = new App();
//app._getPosition();