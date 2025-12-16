// Aca se llevan a cabo los procesos del navegador/cliente
import { createCardClass } from "./components/card_class.js";
import { createCardCategory } from "./components/card_category.js";
import { createCardRace } from "./components/card_race.js";

const $ = selector => document.querySelector(selector);
const main = $('#main');

// State
let appData = {
    class: [],
    category: {},
    races: {},
    setup: {},
    user: {},
    countries: {},
    history: [],
    lastResult: {}
};

let currentSetup = null;

const loadData = async () => {
    try {
        const classData = await window.dataManager.load("data_class.json");
        appData.class = classData.class;
        appData.category = await window.dataManager.load("data_category.json");
        appData.races = await window.dataManager.load("data_races.json");
        appData.setup = await window.dataManager.load("data_setup.json");
        appData.user = await window.dataManager.load("data_user.json");
        appData.countries = await window.dataManager.load("data_country.json");
        appData.history = await window.dataManager.load("data_history.json") || [];
        appData.lastResult = await window.dataManager.load("data_lastResult.json") || {};

        initUI();
    } catch (error) {
        console.error("Error loading data:", error);
    }
};

const initUI = () => {
    renderClasses();
    setUserUI();
    setConfigUI();
    setHistoryUI();
    setupEventListeners();
    appData.user.name ? showScreen('home') : showScreen('config-screen');
};

const renderClasses = () => {
    const class_container = document.createElement("div");
    const loading = $('#loading-screen');
    class_container.id = `class`;
    class_container.classList = "card-container";
    main.appendChild(class_container);

    appData.class.forEach(cls => {
        const class_card = createCardClass(cls);
        class_card.addEventListener('click', () => openCategory(cls.char));
        class_container.appendChild(class_card);

        const category_container = document.createElement("div");
        category_container.id = `category-${cls.char}`;
        category_container.classList = "card-container d-none";
        main.appendChild(category_container);

        const categories = appData.category[cls.char] || [];
        categories.forEach(cat => {
            const category_card = createCardCategory(cls.char, cat);
            category_card.addEventListener('click', () => openRace(cls.char, cat.number));
            category_container.appendChild(category_card);

            const race_container = document.createElement("div");
            race_container.id = `race-${cls.char}-${cat.number}`;
            race_container.classList = "card-container d-none";
            main.appendChild(race_container);

            const races = appData.races[`${cls.char}-${cat.number}`] || [];
            races.forEach(race => {
                const race_card = createCardRace(cls.char, cat.number, race);
                race_card.addEventListener('click', () => openSetup(cls.char, cat.number, race));
                race_container.appendChild(race_card);
            });
        });
    });
    setTimeout(() => {
        loading.classList.add('d-none');
    }, 1000);
};

const setUserUI = () => {
    const fullName = `${appData.user.name} ${appData.user.lastname || ''}`; // lastname might not be in json yet
    $('#user-name').textContent = appData.user.name; // Header
    $('#user-class').textContent = `Class ${appData.user.class}`; // Header

    $('#perfil-name').textContent = fullName;
    $('#perfil-class').textContent = `Clase ${appData.user.class}`;
    $('#perfil-wins').textContent = `Podios: ${appData.user.wins}`;
    $('#perfil-races').textContent = `Carreras: ${appData.user.races}`;

    // Country flag in profile
    if (appData.user.country && appData.countries[appData.user.country]) {
        $('#perfil-country').innerHTML = `<img src="assets/flags/${appData.countries[appData.user.country].flag}" alt="${appData.countries[appData.user.country].name}">`;
    }
};

const setConfigUI = () => {
    $('#config-name').value = appData.user.name || '';
    $('#config-lastname').value = appData.user.lastname || '';

    const countrySelect = $('#config-countries');
    countrySelect.innerHTML = '';
    Object.keys(appData.countries).sort().forEach(code => {
        const country = appData.countries[code];
        const option = document.createElement('option');
        option.value = code;
        option.textContent = country.name;
        if (appData.user.country === code) option.selected = true;
        countrySelect.appendChild(option);
    });

    $('#config-mode').value = appData.user.mode || 'Carrera';
};

const setHistoryUI = () => {
    const tbody = $('#perfil-history');
    tbody.innerHTML = '';
    // Sort history by date desc?
    appData.history.slice().reverse().forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.circuit}</td>
            <td>${entry.vehicle}</td>
            <td>${entry.classification}</td>
            <td>${entry.position}</td>
        `;
        tbody.appendChild(tr);
    });
};

const setupEventListeners = () => {
    // Navigation
    $('#user-button').addEventListener('click', () => showScreen('user-screen'));
    $('#config-button').addEventListener('click', () => showScreen('config-screen'));
    $('#home-button').addEventListener('click', () => showScreen('home'));
    $('#return-button').addEventListener('click', goBack);

    // Config Form
    $('#config-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        appData.user.name = formData.get('name');
        appData.user.lastname = formData.get('lastname');
        appData.user.country = formData.get('country');
        appData.user.mode = formData.get('mode');

        const result = await window.dataManager.save('data_user.json', appData.user);
        if (result.success) {
            setUserUI();
            alert('Configuracion guardada!');
        } else {
            alert('Error al guardar configuracion');
        }
    });

    // Result Save
    $('#result-save').addEventListener('click', async () => {
        const classification = $('#result-classification').value;
        const position = $('#result-race').value;

        if (!classification || !position) {
            alert('Ingrese clasificacion y posicion final');
            return;
        }

        if (!currentSetup) return;

        // Update User Stats
        appData.user.races = (parseInt(appData.user.races) + 1).toString();
        if (parseInt(position) <= 3) {
            appData.user.wins = (parseInt(appData.user.wins) + 1).toString();
        }

        // Add to History
        const newEntry = {
            date: new Date().toLocaleDateString(),
            circuit: currentSetup.circuitName,
            vehicle: currentSetup.carName,
            classification: classification,
            position: position
        };
        appData.history.push(newEntry);

        // Add to Last Result
        let id = `${currentSetup.char}-${currentSetup.category_number}-${currentSetup.race.number}`;
        let lastResult = {
            classification: classification,
            position: position
        };
        appData.lastResult[id] = lastResult;

        // Save Files
        const userSave = await window.dataManager.save('data_user.json', appData.user);
        const historySave = await window.dataManager.save('data_history.json', appData.history);
        const lastResultSave = await window.dataManager.save('data_lastResult.json', appData.lastResult);

        if (userSave.success && historySave.success && lastResultSave.success) {
            setUserUI();
            setHistoryUI();
            alert('Resultados guardados!');
        } else {
            alert('Error al guardar resultados');
        }
    });

    // Extra UI Interactions
    $('#user-editperfil').addEventListener('click', () => showScreen('config-screen'));
    $('#user-resetClass').addEventListener('click', () => $('#user-resetClass-popup').classList.remove('d-none'));
    $('#user-resetClass-popupcancel').addEventListener('click', () => $('#user-resetClass-popup').classList.add('d-none'));
    $('#user-resetClass-popupreset').addEventListener('click', async () => {
        appData.user.class = "D";
        appData.user.wins = "0";
        appData.user.races = "0";
        appData.history = [];
        await window.dataManager.save('data_user.json', appData.user);
        await window.dataManager.save('data_history.json', appData.history);
        setUserUI();
        setHistoryUI();
        $('#user-resetClass-popup').classList.add('d-none');
    });
    $('#setup-info-button').addEventListener('click', () => $('#info-setup-popup').classList.remove('d-none'));
    $('#info-setup-popupcancel').addEventListener('click', () => $('#info-setup-popup').classList.add('d-none'));
};

// Navigation Logic
const showScreen = (screenId) => {
    // Hide all screens
    ['config-screen', 'user-screen', 'setup'].forEach(id => $(`#${id}`).classList.add('d-none'));

    // Hide all card containers
    document.querySelectorAll('.card-container').forEach(el => el.classList.add('d-none'));

    if (screenId === 'home') {
        $('#class').classList.remove('d-none');
        $('#header').classList.remove('d-none');
        $('#home').classList.add('d-none');
    } else {
        $(`#${screenId}`).classList.remove('d-none');
        $('#home').classList.remove('d-none');
    }
};

const goBack = () => {
    showScreen('home');
};

function openCategory(char) {
    $(`#class`).classList.add("d-none");
    $(`#category-${char}`).classList.remove("d-none");
    $('#home').classList.remove('d-none');
}

function openRace(char, category_number) {
    $(`#category-${char}`).classList.add("d-none");
    $(`#race-${char}-${category_number}`).classList.remove("d-none");
}

function openSetup(char, category_number, race) {
    $(`#race-${char}-${category_number}`).classList.add("d-none");
    $('#setup').classList.remove('d-none');
    let id = `${char}-${category_number}-${race.number}`;
    // set Setup Screen
    const result = appData.lastResult && appData.lastResult[id] ? appData.lastResult[id] : null;
    const setupData = appData.setup[`${char}-${category_number}`];
    const raceSetup = setupData[race.number];
    currentSetup = {
        char: char,
        category_number: category_number,
        race: race,
        circuitName: race.circuit_name,
        carName: setupData.car.name
    };

    // set UI elements for setup
    const setupConfig = $('#setup-config');
    setupConfig.innerHTML = `
        <h3>${raceSetup.circuit.name}</h3>
        <p>Carrera: ${raceSetup.set.number}</p>
        <p>Pais: ${raceSetup.circuit.country}</p>
        <p>Curvas: ${raceSetup.circuit.turns}</p>
        <p>Longitud: ${raceSetup.circuit.longitude}</p>
    `;

    const setupCircuit = $('#setup-circuit');
    setupCircuit.innerHTML = `
        <div class="setup-circuit-img">
            <img src="assets/tracks/${raceSetup.circuit.src}">
        </div>
    `;

    const setupParams = $('#setup-params');
    setupParams.innerHTML = `
        <h3>Parametros</h3>
        <p>Clima: ${raceSetup.set.climate}</p>
        <p>Practica: ${raceSetup.set.practice_time}</p>
        <p>Clasificacion: ${raceSetup.set.clasification}</p>
        <p>Carrera: ${raceSetup.set.duration} ${raceSetup.set.type}</p>
        <p>Participantes: ${raceSetup.set.participants}</p>
    `;

    const setupLayout = $('#setup-layout');
    setupLayout.innerHTML = `
        <div class="setup-layout-img">
            <img src="assets/layout/${raceSetup.circuit.layout_src}">
        </div>
    `;

    const setupCar = $('#setup-car');
    setupCar.innerHTML = `
    <div class="setup-car-img">
        <img src="assets/cars/${setupData.car.src}">
    </div>
    <div class="setup-car-details">
        <h3>${setupData.car.name}</h3>
        <p>${setupData.car.description}</p>
    </div>
    `;

    if (result) {
        $('#result-classification').value = result.classification;
        $('#result-race').value = result.position;
    }
    else {
        $('#result-classification').value = '';
        $('#result-race').value = '';
    }
}

loadData();
