function start() {
    // alert("start!");
    let r = document.getElementById("qrshot_root_element");
    if (r != null) {
        document.body.removeChild(r);
    } else {
        setup_start_html_elements();
        browser.runtime.onMessage.addListener(msg_handler);
    }
}

var root;
var cancel_btn;
var again_btn;

var result_board;
var result_text_field
var result_go_btn
var result_newtab_btn
var result_copy_btn

var is_dragging = false;
var dont_start_select = false;
var is_on_certain_button = false;
var squere;
var mouse_start_pos;
var squere_lefttop;

function cancel_btn_clicked() {
    // alert("cancel!");
    document.body.removeChild(document.getElementById("qrshot_root_element"));
}

function again_btn_clicked() {
    root.removeChild(squere);
    squere.style.left = "auto";
    squere.style.right = "auto";
    squere.style.top = "auto";
    squere.style.bottom = "auto";
    root.removeChild(again_btn);
    if (document.getElementById("qrshot_result_board")) root.removeChild(result_board);
    if (result_copy_btn.style.backgroundColor) result_copy_btn.style.removeProperty("background-color");
    cancel_btn.style.left = "40%";
    dont_start_select = false;
    is_on_certain_button = false;
}

function result_go_tab_btn_clicked(type) {
    browser.runtime.sendMessage({ msg_type: ("url_" + type), data: result_text_field.value });
    document.body.removeChild(root);
}

function result_copy_btn_clicked() {
    navigator.clipboard.writeText(result_text_field.value);
    result_copy_btn.style.backgroundColor = "rgba(100, 255, 100, 0.4)";
}

function result_close_btn_clicked() {
    root.removeChild(result_board);
    document.body.removeChild(root);
}

function drag_select_begin(e) {
    if (dont_start_select || is_on_certain_button) return;
    is_dragging = true;
    // console.log(e);
    mouse_start_pos = [e.clientX, e.clientY];
    // let root = document.getElementById("qrshot_root_element");
    squere.style.left = mouse_start_pos[0];
    squere.style.top = mouse_start_pos[1];
    squere.style.backgroundColor = "rgba(150, 200, 255, 0.6)";
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

function drag_select_end(e) {
    if (!is_dragging) return;
    is_dragging = false;
    if (mouse_start_pos[0] == e.clientX || mouse_start_pos[0] == e.clientY) {
        root.appendChild(cancel_btn);
        return;
    }
    dont_start_select = true;

    // let root = document.getElementById("qrshot_root_element");
    cancel_btn.style.left = "23%"
    root.appendChild(cancel_btn);
    root.appendChild(again_btn);

    let offset = [0, 0];
    let cv_sz = [0, 0];
    if (mouse_start_pos[0] < e.clientX) {
        offset[0] = mouse_start_pos[0];
        cv_sz[0] = e.clientX - offset[0];
    } else {
        offset[0] = e.clientX;
        cv_sz[0] = mouse_start_pos[0] - offset[0];
    }
    if (mouse_start_pos[1] < e.clientY) {
        offset[1] = mouse_start_pos[1];
        cv_sz[1] = e.clientY - offset[1];
    } else {
        offset[1] = e.clientY;
        cv_sz[1] = mouse_start_pos[1] - offset[1];
    }
    squere_lefttop = offset;

    document.body.removeChild(root);
    let data = {
        offset_x: offset[0],
        offset_y: offset[1],
        cv_width: cv_sz[0],
        cv_height: cv_sz[1],
        window_width: window.innerWidth,
        window_height: window.innerHeight
    }
    browser.runtime.sendMessage({ msg_type: "qrcode_decode", data: data });
}

function msg_handler(msg) {
    if (msg.msg_type == "decode_result") {
        receive_result_from_background(msg.data);
    } else if (msg.msg_type == "error_report") {
        something_wrong_from_background(msg.data);
    }
}

function receive_result_from_background(decoded) {
    document.body.appendChild(root);
    if (decoded) {
        // console.log("decoded url: " + decoded.data);
        //> focus squere
        let squere_padding = (decoded.location.bottomRightCorner.x - decoded.location.topLeftCorner.x) * 0.05;
        squere.style.left = squere_lefttop[0] + decoded.location.topLeftCorner.x - squere_padding + "px";
        squere.style.top = squere_lefttop[1] + decoded.location.topLeftCorner.y - squere_padding + "px";
        squere.style.right = root.clientWidth - (squere_lefttop[0] + decoded.location.bottomRightCorner.x) - squere_padding + "px";
        squere.style.bottom = root.clientHeight - (squere_lefttop[1] + decoded.location.bottomRightCorner.y) - squere_padding + "px";
        squere.style.backgroundColor = "rgba(200, 255, 150, 0.6)";

        //> result board
        let is_url = decoded.data.startsWith("http://") || decoded.data.startsWith("https://");
        result_text_field.value = decoded.data;
        result_text_field.disabled = is_url;
        result_go_btn.disabled = !is_url;
        result_newtab_btn.disabled = !is_url;
        if (root.clientHeight - (squere_lefttop[1] + decoded.location.bottomRightCorner.y) - squere_padding > 120) {
            result_board.style.top = (squere_lefttop[1] + decoded.location.bottomRightCorner.y) - squere_padding - 10 + "px";
            if (result_board.style.bottom) result_board.style.removeProperty("bottom");
        } else {
            if (result_board.style.top) result_board.style.removeProperty("top");
            result_board.style.bottom = "0px";
        }
        if (root.clientWidth - (squere_lefttop[0] + decoded.location.topLeftCorner.x - squere_padding) > 272) {
            result_board.style.left = squere_lefttop[0] + decoded.location.topLeftCorner.x - squere_padding + "px";
            if (result_board.style.right) result_board.style.removeProperty("right");
        } else {
            result_board.style.right = "0px";
            if (result_board.style.left) result_board.style.removeProperty("left");
        }
        root.appendChild(result_board);
    } else {
        console.log("fail to recognize qrcode");
        squere.style.backgroundColor = "rgba(255, 150, 150, 0.6)";
    }
}

function something_wrong_from_background(error_str) {
    alert("qrshot error: " + error_str);
    let r = document.getElementById("qrshot_root_element");
    if (r != null) {
        document.body.removeChild(r);
    }
}

function setup_start_html_elements() {
    //> root node 
    root = document.createElement("div");
    root.id = "qrshot_root_element";
    root.addEventListener("mousedown", drag_select_begin);
    root.addEventListener("mousemove", drag_selecting);
    root.addEventListener("mouseup", drag_select_end);

    //> cancel button
    cancel_btn = document.createElement("button");
    cancel_btn.id = "qrshot_cancel_btn";
    cancel_btn.classList.add("qrshot_btn");
    cancel_btn.style.left = "40%";
    cancel_btn.addEventListener("click", cancel_btn_clicked);
    cancel_btn.addEventListener("mouseenter", () => { is_on_certain_button = true; });
    cancel_btn.addEventListener("mouseleave", () => { is_on_certain_button = false; });
    cancel_btn.innerText = "Cancel";
    root.appendChild(cancel_btn);

    //> again button
    again_btn = document.createElement("button");
    again_btn.id = "qrshot_again_btn";
    again_btn.style.right = "23%";
    again_btn.classList.add("qrshot_btn");
    again_btn.addEventListener("click", again_btn_clicked);
    again_btn.addEventListener("mouseenter", () => { is_on_certain_button = true; });
    again_btn.addEventListener("mouseleave", () => { is_on_certain_button = false; });
    again_btn.innerText = "Again";

    //> squere 
    squere = document.createElement("div");
    squere.id = "qrshot_squere";

    //> result board
    result_board = document.createElement("div");
    result_board.id = "qrshot_result_board";
    // result_board.style.width = "300px";
    // result_board.style.height = "100px";

    result_text_field = document.createElement("input");
    result_text_field.id = "qrshot_result_text_field";
    result_text_field.type = "text";

    result_go_btn = document.createElement("button");
    result_go_btn.id = "qrshot_result_go_btn";
    result_go_btn.classList.add("qrshot_result_board_btns");
    result_go_btn.innerText = "Go";
    result_go_btn.addEventListener("click", () => { result_go_tab_btn_clicked("go") });

    result_newtab_btn = document.createElement("button");
    result_newtab_btn.id = "qrshot_result_newtab_btn";
    result_newtab_btn.classList.add("qrshot_result_board_btns");
    result_newtab_btn.innerText = "NewTab";
    result_newtab_btn.addEventListener("click", () => { result_go_tab_btn_clicked("newtab") });

    result_copy_btn = document.createElement("button");
    result_copy_btn.id = "qrshot_result_copy_btn";
    result_copy_btn.classList.add("qrshot_result_board_btns");
    result_copy_btn.innerText = "Copy";
    result_copy_btn.addEventListener("click", result_copy_btn_clicked);
    result_text_field.addEventListener("input", () => {
        if (result_copy_btn.style.backgroundColor) result_copy_btn.style.removeProperty("background-color");
    });

    let result_close_btn = document.createElement("button");
    result_close_btn.id = "qrshot_result_close_btn";
    result_close_btn.innerText = "X";
    result_close_btn.addEventListener("click", result_close_btn_clicked);

    let result_line_container_up = document.createElement("div");
    result_line_container_up.classList.add("qrshot_result_line_container");
    result_line_container_up.appendChild(result_text_field);
    let result_line_container_down = document.createElement("div");
    result_line_container_down.classList.add("qrshot_result_line_container");
    result_line_container_down.appendChild(result_copy_btn);
    result_line_container_down.appendChild(result_go_btn);
    result_line_container_down.appendChild(result_newtab_btn);

    result_board.appendChild(result_line_container_up);
    result_board.appendChild(result_line_container_down);
    result_board.appendChild(result_close_btn);
    // root.appendChild(result_board);

    //> append root to body
    document.body.appendChild(root);
}

start();