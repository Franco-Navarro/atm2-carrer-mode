export function createCardCategory(char,category) {
    const div = document.createElement("div");
    div.classList = "bg-card card";
    div.id = `category-${char}-${category.number}`;
    div.innerHTML = `<div class="card-title justify-start">
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