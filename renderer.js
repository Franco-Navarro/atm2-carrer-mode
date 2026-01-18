// Aca se llevan a cabo los procesos del navegador/cliente
import { createCardClass } from "./components/card_class.js";
import { createCardCategory } from "./components/card_category.js";
import { createCardRace, setLabelRace } from "./components/card_race.js";
import { createAlert } from "./components/alert.js";

const $ = selector => document.querySelector(selector);
const main = $('#main');

let appData = {
    class: [],
    category: {},
    races: {},
    setup: {},
    dlc: {},
    user: {},
    countries: {},
    history: [],
    lastRace: null
};

let currentSetup = null;
let currentScreen = null;
let navigationHistory = [];
let scrollPos = 0;

const loadData = async () => {
    try {
        const classData = await window.dataManager.load("data_class.json");
        appData.class = classData.class;
        appData.category = await window.dataManager.load("data_category.json");
        appData.races = await window.dataManager.load("data_races.json");
        appData.setup = await window.dataManager.load("data_setup.json");
        appData.dlc = await window.dataManager.load("data_dlc.json");
        appData.user = await window.dataManager.load("data_user.json");
        appData.countries = await window.dataManager.load("data_country.json");
        appData.history = await window.dataManager.load("data_history.json") || [];

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
    const fullName = `${appData.user.name} ${appData.user.lastname || ''}`;
    $('#user-name').textContent = appData.user.name;
    $('#user-class').textContent = `Class ${appData.user.class}`;
    $('#perfil-name').textContent = fullName;
    $('#perfil-class').textContent = `Clase ${appData.user.class}`;
    $('#perfil-wins').textContent = `Podios: ${appData.user.wins}`;
    $('#perfil-races').textContent = `Carreras: ${appData.user.races}`;
    if (appData.user.country && appData.countries[appData.user.country]) {
        $('#perfil-country').innerHTML = `<img src="assets/flags/${appData.countries[appData.user.country].flag}" alt="${appData.countries[appData.user.country].name}">`;
    }
    setLastRaceUI();
};

const setLastRaceUI = () => {
    const lastRace = appData.history[appData.history.length - 1];
    if (!lastRace) return;
    $('#perfil-lastrace').innerHTML = `        
        <div class="perfil-lastrace-pos">
          <h4>Ultima Carrera</h4>
          <p>Posicion Final: ${lastRace.position}</p>
          <p>Clasificacion: ${lastRace.classification}</p>
          <p>Fecha: ${lastRace.date}</p>
        </div>
        <div class="perfil-lastrace-circuit">
          <h5>${lastRace.circuit}</h5>
          <img src="assets/layout/${lastRace.layout_src}" alt="${lastRace.circuit}">
        </div>
        <div class="perfil-lastrace-car">
          <h5>${lastRace.car_name}</h5>
          <img src="assets/cars/${lastRace.car_src}" alt="${lastRace.car_name}">
        </div>`;
};

const setConfigUI = () => {
    $('#config-name').value = appData.user.name || '';
    $('#config-lastname').value = appData.user.lastname || '';
    $('#config-mode').value = appData.user.mode || 'Carrera';

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
    const dlcContainer = $('#config-dlc');
    dlcContainer.innerHTML = '';
    Object.keys(appData.dlc).sort().forEach(code => {
        const dlc = appData.dlc[code];
        const item = document.createElement('label');
        item.classList.add('config-dlc-list-item');
        item.innerHTML = `
            ${dlc.name}
            <input type="checkbox" id="dlc-${code}" name="dlc-${code}" value="${code}">
            <span class="checkmark"></span>`;
        if (appData.user.dlc && appData.user.dlc[code]) item.querySelector('input').checked = true;
        dlcContainer.appendChild(item);
    });
};

const setHistoryUI = () => {
    const tbody = $('#perfil-history');
    tbody.innerHTML = '';
    appData.history.slice().reverse().forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.circuit}</td>
            <td>${entry.car_name}</td>
            <td>${entry.classification}</td>
            <td>${entry.position}</td>  
        `;
        tbody.appendChild(tr);
    });
};

const openPopup = (popupId) => {
    $(`#${popupId}`).classList.remove('d-none');
}

const closePopup = (popupId) => {
    $(`#${popupId}`).classList.add('d-none');
}

const setupEventListeners = () => {
    // Navigation
    $('#user-button').addEventListener('click', () => showScreen('user-screen'));
    $('#user-editperfil').addEventListener('click', () => showScreen('config-screen'));
    $('#config-button').addEventListener('click', () => showScreen('config-screen'));
    $('#home-button').addEventListener('click', () => showScreen('home'));
    $('#return-button').addEventListener('click', goBack);
    $('#button-wrapper-left').addEventListener('click', () => wrapperCard('left'));
    $('#button-wrapper-right').addEventListener('click', () => wrapperCard('right'));

    // Config Form Save
    $('#config-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        openPopup('config-save-popup');
    });

    $('#config-save-popupsave').addEventListener('click', async () => {
        const formData = new FormData($('#config-form'));
        appData.user.name = formData.get('name');
        appData.user.lastname = formData.get('lastname');
        appData.user.country = formData.get('country');
        appData.user.mode = formData.get('mode');
        Object.keys(appData.dlc).sort().forEach(code => {
            let dlc = formData.get(`dlc-${code}`)
            if (dlc) appData.user.dlc[code] = true;
            else appData.user.dlc[code] = false;
        });
        const result = await window.dataManager.save('data_user.json', appData.user);
        if (result.success) {
            setUserUI();
            createAlert('Configuracion guardada', 'success');
            closePopup('config-save-popup');
        } else {
            createAlert('Error al guardar configuracion', 'error');
            closePopup('config-save-popup');
        }
    })

    $('#config-save-popupcancel').addEventListener('click', () => {
        closePopup('config-save-popup');
    })

    $('#config-form').addEventListener('reset', async (e) => {
        e.preventDefault();
        openPopup('config-reset-popup');
    });

    $('#config-reset-popupcancel').addEventListener('click', () => {
        closePopup('config-reset-popup');
    });

    $('#config-reset-popupreset').addEventListener('click', () => {
        $('#config-name').value = '';
        $('#config-lastname').value = '';
        $('#config-countries').value = 'AR';
        $('#config-mode').value = 'Carrera';
        Object.keys(appData.dlc).sort().forEach(code => {
            $('#dlc-' + code).checked = false;
        });
        createAlert('Los cambios no se aplicaran hasta que guarde', 'info');
        closePopup('config-reset-popup');
    })

    // Result Save
    $('#result-save').addEventListener('click', async () => {
        const position = $('#result-race').value;

        if (!position) {
            createAlert('Ingrese una posicion final', 'error');
            return;
        }

        openPopup('result-save-popup');
    });

    $('#result-save-popupcancel').addEventListener('click', () => {
        closePopup('result-save-popup');
    });

    $('#result-save-popupsave').addEventListener('click', async () => {
        const classification = $('#result-classification').value;
        const position = $('#result-race').value;
        if (!position) {
            createAlert('Ingrese una posicion final', 'error');
            return;
        }

        if (!currentSetup) return;
        appData.user.races = (parseInt(appData.user.races) + 1).toString();
        if (parseInt(position) <= 3) {
            appData.user.wins = (parseInt(appData.user.wins) + 1).toString();
        }

        let id = `${currentSetup.char}-${currentSetup.category_number}`;
        let number = currentSetup.race.number - 1;
        let race = $(`#race-${currentSetup.char}-${currentSetup.category_number}-${currentSetup.race.number}`);

        const newEntry = {
            position: position,
            classification: classification,
            date: new Date().toLocaleDateString(),
            circuit: currentSetup.race.circuit_name,
            layout_src: currentSetup.race.layout_src,
            car_name: currentSetup.car.name,
            car_src: currentSetup.car.src
        };
        appData.history.push(newEntry);

        if (!appData.races[id][number].position || parseInt(position) <= appData.races[id][number].position) {
            appData.races[id][number].classification = classification;
            appData.races[id][number].position = position;
            setLabelRace(race, position);
        }

        const userSave = await window.dataManager.save('data_user.json', appData.user);
        const historySave = await window.dataManager.save('data_history.json', appData.history);
        const racesSave = await window.dataManager.save('data_races.json', appData.races);

        if (userSave.success && historySave.success && racesSave.success) {
            createAlert('Resultados guardados', 'success');
            setUserUI();
            setHistoryUI();
            closePopup('result-save-popup');
        } else {
            createAlert('Error al guardar resultados', 'error');
            closePopup('result-save-popup');
        }
    });

    // Reset Class
    $('#user-resetClass').addEventListener('click', () => $('#user-resetClass-popup').classList.remove('d-none'));
    $('#user-resetClass-popupcancel').addEventListener('click', () => $('#user-resetClass-popup').classList.add('d-none'));
    $('#user-resetClass-popupreset').addEventListener('click', async () => {
        appData.user.class = "D";
        appData.user.wins = "0";
        appData.user.races = "0";
        appData.history = [];
        const races = appData.races;
        Object.keys(races).forEach(key => {
            races[key].forEach(race => {
                let card = $(`#race-${key}-${race.number}`);
                if (race.position) {
                    race.position = null;
                    race.classification = null;
                    setLabelRace(card, null);
                }
            });
        });
        await window.dataManager.save('data_user.json', appData.user);
        await window.dataManager.save('data_history.json', appData.history);
        await window.dataManager.save('data_races.json', races);
        setUserUI();
        setHistoryUI();
        createAlert('Clase restablecida', 'success');
        $('#user-resetClass-popup').classList.add('d-none');
    });

    // Info Setup
    $('#setup-info-button').addEventListener('click', () => $('#info-setup-popup').classList.remove('d-none'));
    $('#info-setup-popupcancel').addEventListener('click', () => $('#info-setup-popup').classList.add('d-none'));
};



const wrapperCard = (direction) => {
    const main = $(currentScreen === "#home" ? "#class" : currentScreen);
    if (!main) {
        showScreen('home');
        return;
    }
    const maxScroll = main.scrollWidth - main.offsetWidth;
    if (direction === 'left') {
        scrollPos += 306;
        if (scrollPos > 0) {
            scrollPos = 0;
        }
    } else {
        scrollPos -= 306;
        if (scrollPos < -maxScroll) {
            scrollPos = -maxScroll;
        }
    }
    main.style.transform = `translateX(${scrollPos}px)`;
}

const resetMain = () => {
    const noWrapper = ['#config-screen', '#user-screen', '#setup'];
    const main = $(currentScreen === "#home" ? "#class" : currentScreen);
    if (!main) {
        showScreen('home');
        return;
    }

    main.style.transform = 'translateX(0)';
    scrollPos = 0;

    if (main.scrollWidth > main.offsetWidth && !noWrapper.includes(currentScreen)) {
        $('#button-wrapper-left').classList.remove('d-none');
        $('#button-wrapper-right').classList.remove('d-none');
    }
    else {
        $('#button-wrapper-left').classList.add('d-none');
        $('#button-wrapper-right').classList.add('d-none');
    }
}

const showScreen = (screenId) => {
    if (screenId === 'home') {
        navigationHistory = [];
    } else if (currentScreen && currentScreen !== `#${screenId}`) {
        navigationHistory.push(currentScreen);
    }

    currentScreen = `#${screenId}`;
    ['config-screen', 'user-screen', 'setup'].forEach(id => $(`#${id}`).classList.add('d-none'));
    document.querySelectorAll('.card-container').forEach(el => el.classList.add('d-none'));

    if (screenId === 'home') {
        $('#class').classList.remove('d-none');
        $('#header').classList.remove('d-none');
        $('#home').classList.add('d-none');
    } else {
        $(`#${screenId}`).classList.remove('d-none');
        $('#home').classList.remove('d-none');
    }
    resetMain();
}

const goBack = () => {
    if (navigationHistory.length === 0) {
        showScreen('home');
        return;
    }

    if (currentScreen === '#home') {
        $('#class').classList.add('d-none');
        $('#header').classList.add('d-none');
    } else {
        const el = $(currentScreen);
        if (el) el.classList.add('d-none');
    }

    const prevScreen = navigationHistory.pop();
    currentScreen = prevScreen;

    if (prevScreen === '#home') {
        $('#class').classList.remove('d-none');
        $('#header').classList.remove('d-none');
        $('#home').classList.add('d-none');
    } else {
        const el = $(prevScreen);
        if (el) el.classList.remove('d-none');
        $('#home').classList.remove('d-none');
    }
    resetMain();
}

function openCategory(char) {
    if (currentScreen) navigationHistory.push(currentScreen);
    currentScreen = `#category-${char}`;
    $(`#class`).classList.add("d-none");
    $(`#category-${char}`).classList.remove("d-none");
    $('#home').classList.remove('d-none');
    resetMain();
}

function openRace(char, category_number) {
    if (currentScreen) navigationHistory.push(currentScreen);
    currentScreen = `#race-${char}-${category_number}`;
    $(`#category-${char}`).classList.add("d-none");
    $(`#race-${char}-${category_number}`).classList.remove("d-none");
    resetMain();
}

function openSetup(char, category_number, race) {
    if (currentScreen) navigationHistory.push(currentScreen);
    currentScreen = `#setup`;
    $(`#race-${char}-${category_number}`).classList.add("d-none");
    $('#setup').classList.remove('d-none');
    const setupData = appData.setup[`${char}-${category_number}`];
    const raceSetup = setupData[race.number];
    currentSetup = {
        char: char,
        category_number: category_number,
        race: race,
        circuitName: race.circuit_name,
        car: setupData.car
    };

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

    if (race.classification && race.position) {
        $('#result-classification').value = race.classification;
        $('#result-race').value = race.position;
    }
    else {
        $('#result-classification').value = '';
        $('#result-race').value = '';
    }
    resetMain();
}

loadData();

// RESPONSIBIDAD