function start() {
    // alert("start!");
    let background = document.createElement("div");
    background.style.width = "100%";
    background.style.height = "100%";
    background.style.bottom = 0;
    background.style.top = 0;
    background.style.left = 0;
    background.style.right = 0;
    background.style.zIndex = 10000000000;
    background.style.backgroundColor = "rgba(0,0,0,0.5)";
    background.style.position = "fixed";
    document.body.appendChild(background);
}

start();