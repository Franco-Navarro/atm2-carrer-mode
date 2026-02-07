export function createCardCategory(char, category, position) {
    let band = '';
    if (position && position >= 1) {
        switch (position.toString()) {
            case "1":
                band = `<div class="card-label result-category bg-gold">
                            <img src="./assets/img/crown.svg" alt="">
                        </div>`;
                break;
            case "2":
                band = `<div class="card-label result-category bg-silver">
                            <img src="./assets/img/crown.svg" alt="">
                        </div>`;
                break;
            case "3":
                band = `<div class="card-label result-category bg-bronce">
                            <img src="./assets/img/crown.svg" alt="">
                        </div>`;
                break;
            default:
                band = `<div class="card-label result-category bg-secondary">
                            <img src="./assets/img/crown.svg" alt="">
                        </div>`;
                break;
        }
    }
    else {
        band = `<div class="card-label result-category"></div>`;
    }
    const div = document.createElement("div");
    div.classList = "bg-card card";
    div.id = `category-${char}-${category.number}`;
    div.innerHTML = `${band}
                    <div class="card-title justify-start">
                        <div class="card-title-text ">
                            <h3>${category.number}</h3>
                            <label>${char} Class</label>
                        </div>
                    </div>
                    <div  class="card-car">
                        <div class="card-car-img transform-flip">
                            <img src="./assets/cars/${category.car_src}" alt="">
                        </div>
                    </div>
                    <div  class="card-info">
                        <h2>${category.car_name}</h2>
                        <label>${category.description}</label>
                    </div>`;
    return div;
}

export function setLabelCategory(category, position) {
    let band = category.querySelector('.card-label')
    if (position && position >= 1) {
        band.innerHTML = '<img src="./assets/img/crown.svg" alt="">';
        switch (position.toString()) {
            case "1":
                band.classList = `card-label result-category bg-gold`;
                break;
            case "2":
                band.classList = `card-label result-category bg-silver`;
                break;
            case "3":
                band.classList = `card-label result-category bg-bronce`;
                break;
            default:
                band.classList = `card-label result-category bg-secondary`;
                break;
        }
    }
    else {
        band.classList = `card-label result-category`;
        band.innerHTML = '';
    }
}