export function createCardClass(class_list, position) {
    let band = '';
    if (position && position >= 1) {
        switch (position.toString()) {
            case "1":
                band = `<div class="card-label result-class bg-gold">
                            <img src="./assets/img/trophy.svg" alt="">
                        </div>`;
                break;
            case "2":
                band = `<div class="card-label result-class bg-silver">
                            <img src="./assets/img/trophy.svg" alt="">
                        </div>`;
                break;
            case "3":
                band = `<div class="card-label result-class bg-bronce">
                            <img src="./assets/img/trophy.svg" alt="">
                        </div>`;
                break;
            default:
                band = `<div class="card-label result-class bg-secondary">
                            <img src="./assets/img/trophy.svg" alt="">
                        </div>`;
                break;
        }
    }
    else {
        band = `<div class="card-label result-class"></div>`;
    }
    const div = document.createElement("div");
    div.classList = "bg-card card";
    div.id = `class-${class_list.char}`;
    div.innerHTML = `${band}
                    <div class="card-title">
                        <div class="card-title-text">
                            <h3>${class_list.char}</h3>
                            <label>Class</label>
                        </div>
                    </div>
                    <div  class="card-car">
                        <div class="card-car-img">
                            <img src="./assets/cars/${class_list.car_src}">
                        </div>
                    </div>
                    <div  class="card-info">
                        <h2>${class_list.title}</h2>
                        <label>${class_list.description}</label>
                    </div>`;
    return div;
}

export function setLabelClass(class_list, position) {
    let band = class_list.querySelector('.card-label')
    if (position && position >= 1) {
        band.innerHTML = '<img src="./assets/img/trophy.svg" alt="">';
        switch (position.toString()) {
            case "1":
                band.classList = `card-label result-class bg-gold`;
                break;
            case "2":
                band.classList = `card-label result-class bg-silver`;
                break;
            case "3":
                band.classList = `card-label result-class bg-bronce`;
                break;
            default:
                band.classList = `card-label result-class bg-secondary`;
                break;
        }
    }
    else {
        band.classList = `card-label result-class`;
        band.innerHTML = '';
    }
}