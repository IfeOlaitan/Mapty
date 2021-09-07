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


class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);


    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }
}

class Running extends Workout {
    type = 'running';

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.candence = cadence;
        this.calcPace();
    }

    calcPace() {
        this.pace = this.duration / this.duration;
        return this.pace;
    }
}

class Cycling extends Workout {
    type = 'cycling';

    constructor(coords, distance, duration,elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }

    calcSpeed() {
        this.speed = this.distance / (this.duration / 60);
    }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycle1 = new Cycling([39, -12], 5.2, 24, 178);
// console.log(run1, cycle1);


class App {
    #map;
    #mapEvent;
    #workouts = [];

    constructor() {
        this._getPosition();
        
        //*Event Listeners
        //Event Listener for form
        form.addEventListener('submit', this._newWorkout.bind(this));
        //Event Listener to toggle btw input cadence and input elevation
        inputType.addEventListener('change', this._toggleElevationField);
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
        //console.log(this);
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
        //Function to check valid input
        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    
        //Function to check positive numbers
        const allPositive = (...inputs) => inputs.every(inp => inp > 0);
        
        e.preventDefault();

        //Get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const { lat, lng } = this.#mapEvent.latlng;
        let workout;


        //If workout running, create running object
        if (type === 'running') {
            const candence = +inputCadence.value;

            //Check if data is valid 
            if (!validInputs(distance, duration, candence) || !allPositive(distance, duration, candence))
                return alert('Inputs have to be positive numbers');
            
            workout = new Running([lat, lng], distance, duration, candence);
        }

        //If workout cyling, create running object
        if (type === 'cycling') {
            const elevation = +inputElevation.value;

            //Check if data is valid
            if (!validInputs(distance, duration, elevation) || !allPositive(distance, duration))
                return alert('Inputs have to be positive numbers');
            
            workout = new Cycling([lat, lng], distance, duration, elevation);
        }

        //Add new object to workouts array
        this.#workouts.push(workout);
        console.log(workout);

        //Render workout on map as a marker
        this.renderWorkoutMarker(workout);

        //Hide form + clear input form
        
        //Render workout on a list
        
        //Hide form + Clear input fields
        inputDuration.value = inputDistance.value = inputCadence.value = inputElevation.value = '';

        //Display marker
    }

    renderWorkoutMarker(workout) {
        //Create marker after clicking on a point on the map
        L.marker(workout.coords) //creates a marker
        .addTo(this.#map) //adds the marker to the map
        .bindPopup(L.popup({
            maxwidth: 250,
            minwidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`
        })) //creates a popup and binds it to the marker
        .setPopupContent('workout') //Set content for popup
        .openPopup(); //open popup
    }
}

const app = new App();