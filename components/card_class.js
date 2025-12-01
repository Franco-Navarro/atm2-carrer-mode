export function createCardClass(class_list) {
    const div = document.createElement("div");
    div.classList = "bg-card card";
    div.id = `class-${class_list.char}`;
    div.innerHTML = `<div class="card-title">
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