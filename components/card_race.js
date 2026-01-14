export function createCardRace(char, category, race) {
    let band = '';
    if (race.position && race.position >= 1) {
        switch (race.position.toString()) {
            case "1":
                band = `<div class="card-label result-race bg-gold">${race.position}</div>`;
                break;
            case "2":
                band = `<div class="card-label result-race bg-silver">${race.position}</div>`;
                break;
            case "3":
                band = `<div class="card-label result-race bg-bronce">${race.position}</div>`;
                break;
            default:
                band = `<div class="card-label result-race bg-secondary">${race.position}</div>`;
                break;
        }
    }
    else {
        band = `<div class="card-label result-race"></div>`;
    }
    const div = document.createElement("div");
    div.classList = "bg-card card";
    div.id = `race-${char}-${category}-${race.number}`;
    div.innerHTML = `${band}
                    <div class="card-title justify-start">
                        <div class="card-title-text ">
                            <h3>#${race.number}</h3>
                            <label>Carrera</label>
                        </div>
                    </div>
                    <div class="card-layout">
                        <div class="card-layout-img">
                            <img src="./assets/layout/${race.layout_src}" alt="">
                        </div>
                    </div>
                    <div class="card-info">
                        <h2>${race.circuit_name}</h2>
                        <label>${race.circuit_country}</label>
                        <label>${race.circuit_length} Metros</label>
                    </div>  `;
    return div;
}


export function setLabelRace(race, position) {
    let band = race.querySelector('.card-label')
    if (position && position >= 1) {
        band.innerHTML = position;
        switch (position.toString()) {
            case "1":
                band.classList = `card-label result-race bg-gold`;
                break;
            case "2":
                band.classList = `card-label result-race bg-silver`;
                break;
            case "3":
                band.classList = `card-label result-race bg-bronce`;
                break;
            default:
                band.classList = `card-label result-race bg-secondary`;
                break;
        }
    }
    else {
        band.classList = `card-label result-race`;
        band.innerHTML = '';
    }
}