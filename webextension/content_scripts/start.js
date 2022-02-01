function start() {
    // alert("start!");
    let r = document.getElementById("qrshot_root_element");
    if (r != null) {
        document.body.removeChild(r);
    } else {
        setup_start_html_elements();
    }
}

var root;
var cancel_btn;
var again_btn;

var is_dragging = false;
var dont_start_select = false;
var is_on_certain_button = false;
var squere;
var mouse_start_pos;

function cancel_btn_clicked() {
    // alert("cancel!");
    document.body.removeChild(document.getElementById("qrshot_root_element"));
}

function again_btn_clicked() {
    root.removeChild(squere);
    root.removeChild(again_btn);
    cancel_btn.style.left = "40%";
    dont_start_select = false;
    is_on_certain_button = false;
}

function drag_select_begin(e) {
    if (dont_start_select || is_on_certain_button) return;
    is_dragging = true;
    mouse_start_pos = [e.clientX, e.clientY];
    // let root = document.getElementById("qrshot_root_element");
    squere = document.createElement("div");
    squere.id = "qrshot_squere";
    squere.style.left = mouse_start_pos[0];
    squere.style.top = mouse_start_pos[1];
    // console.log(mouse_start_pos);
    root.appendChild(squere);
    root.removeChild(cancel_btn);
    // if (again_btn) root.removeChild(again_btn);
}

function drag_selecting(e) {
    if (!is_dragging) return;
    // let root = document.getElementById("qrshot_root_element");
    if (mouse_start_pos[0] < e.clientX) {
        squere.style.left = mouse_start_pos[0] + "px";
        squere.style.right = (root.clientWidth - e.clientX) + "px";
    } else {
        squere.style.left = e.clientX + "px";
        squere.style.right = (root.clientWidth - mouse_start_pos[0]) + "px";
    }
    if (mouse_start_pos[1] < e.clientY) {
        squere.style.top = mouse_start_pos[1] + "px";
        squere.style.bottom = (root.clientHeight - e.clientY) + "px";
    } else {
        squere.style.top = e.clientY + "px";
        squere.style.bottom = (root.clientHeight - mouse_start_pos[1]) + "px";
    }
}

function drag_select_end() {
    if (!is_dragging) return;
    is_dragging = false;
    dont_start_select = true;

    // let root = document.getElementById("qrshot_root_element");
    cancel_btn.style.left = "23%"
    root.appendChild(cancel_btn);
    // again_btn = document.createElement("button");
    again_btn = document.createElement("button");
    again_btn.id = "qrshot_again_btn";
    again_btn.style.right = "23%";
    again_btn.classList.add("qrshot_btn");
    again_btn.addEventListener("click", again_btn_clicked);
    again_btn.addEventListener("mouseenter", () => { is_on_certain_button = true; });
    again_btn.addEventListener("mouseleave", () => { is_on_certain_button = false; });
    again_btn.innerText = "Again";
    root.appendChild(again_btn);
}

function setup_start_html_elements() {
    root = document.createElement("div");
    root.id = "qrshot_root_element";
    root.addEventListener("mousedown", drag_select_begin);
    root.addEventListener("mousemove", drag_selecting);
    root.addEventListener("mouseup", drag_select_end);

    cancel_btn = document.createElement("button");
    cancel_btn.id = "qrshot_cancel_btn";
    cancel_btn.classList.add("qrshot_btn");
    cancel_btn.style.left = "40%";
    cancel_btn.addEventListener("click", cancel_btn_clicked);
    cancel_btn.addEventListener("mouseenter", () => { is_on_certain_button = true; });
    cancel_btn.addEventListener("mouseleave", () => { is_on_certain_button = false; });
    cancel_btn.innerText = "Cancel";
    root.appendChild(cancel_btn);
    document.body.appendChild(root);
}

start();