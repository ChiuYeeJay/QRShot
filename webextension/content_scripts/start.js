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

function cancel_btn_clicked() {
    // alert("cancel!");
    document.body.removeChild(document.getElementById("qrshot_root_element"));
}

var is_dragging = false;
var squere;
var mouse_start_pos;

function drag_select_begin(e) {
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
    is_dragging = false;
    // let root = document.getElementById("qrshot_root_element");
    root.removeEventListener("mousedown", drag_select_begin);
    root.removeEventListener("mousemove", drag_selecting);
    root.removeEventListener("mouseup", drag_select_end);

    root.appendChild(cancel_btn);
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
    cancel_btn.addEventListener("click", cancel_btn_clicked);
    cancel_btn.innerText = "Cancel";
    root.appendChild(cancel_btn);
    document.body.appendChild(root);
}

start();