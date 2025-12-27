export function createCardRace(char, category, race) {
    let band = '';
    if (race.position && race.position >= 1 && race.position <= 3) {
        switch (race.position) {
            case "1":
                band = `<div class="card-label result-race bg-gold"></div>`;
                break;
            case "2":
                band = `<div class="card-label result-race bg-silver"></div>`;
                break;
            case "3":
                band = `<div class="card-label result-race bg-bronce"></div>`;
                break;
        }
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
