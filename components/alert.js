export function createAlert(message, type) {
    const div = document.createElement("div");
    switch (type) {
        case 'success':
            div.innerHTML = `<div class="alert bg-success">
                                <div class="alert-content">
                                    <p>${message}</p>
                                    <img src="assets/img/check.svg" alt="check">
                                </div>
                            </div>`;
            break;
        case 'error':
            div.innerHTML = `<div class="alert bg-error">
                                <div class="alert-content">
                                    <p>${message}</p>
                                    <img src="assets/img/error.svg" alt="error">
                                </div>
                            </div>`;
            break;
        case 'warning':
            div.innerHTML = `<div class="alert bg-warning">
                                <div class="alert-content">
                                    <p>${message}</p>
                                    <img src="assets/img/error.svg" alt="error">
                                </div>
                            </div>`;
            break;
        default:
            div.innerHTML = `<div class="alert bg-info">    
                                <div class="alert-content">
                                    <p>${message}</p>
                                    <img src="assets/img/info.svg" alt="info">
                                </div>
                            </div>`;
            break;
    }

    document.body.appendChild(div);
    setTimeout(() => {
        div.remove();
    }, 3000);
}