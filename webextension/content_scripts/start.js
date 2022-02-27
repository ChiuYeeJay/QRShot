// start()
// When the toolbar button is clicked, the function will be called.
// If there is some qrshot elements on the page already, we remove all qrshot elements and listener.
// If not, it will setup all qrshot elements and message listener.
function start() {
    let r1 = document.getElementById("qrshot_curtain_frame");
    let r2 = document.getElementById("qrshot_result_frame");
    let r3 = document.getElementById("qrshot_cancel_btn_frame");
    let r4 = document.getElementById("qrshot_again_btn_frame");

    if (r1 != null || r2 != null || r3 != null || r4 != null) {
        if (r1 != null) document.body.removeChild(r1);
        if (r2 != null) document.body.removeChild(r2);
        if (r3 != null) document.body.removeChild(r3);
        if (r4 != null) document.body.removeChild(r4);
        browser.runtime.onMessage.removeListener(msg_handler);
        clearInterval(root_highlight_resize_interval);
    } else {
        setup_curtain_html_elements();
        setup_btns_html_elements();
        setup_result_frame_html_elements();
        browser.runtime.onMessage.addListener(msg_handler);
        root_highlight_resize_interval = setInterval(root_highlight_resize, 2000);
    }
}

var curtain;
var curtain_frame;

var cancel_btn_frame;
var cancel_btn;
var again_btn_frame;
var again_btn;

var result_frame;
var result_board;
var result_text_field;
var result_go_btn;
var result_newtab_btn;
var result_copy_btn;
// var is_result_board_dragging = false;

var is_dragging = false;
var dont_start_select = false;
var is_on_certain_button = false;
var highlight;
var mouse_start_pos;
var mouse_start_screen_pos;
var highlight_lefttop = [0, 0];

var root_highlight_resize_interval;

function setup_curtain_html_elements() {
    //> curtain frame
    curtain_frame = document.createElement("iframe");
    curtain_frame.id = "qrshot_curtain_frame";
    curtain_frame.style.height = get_page_height() + "px";
    curtain_frame.style.width = get_page_width() + "px";
    curtain_frame.style.position = "absolute";
    curtain_frame.style.top = "0px";
    curtain_frame.style.left = "0px";
    curtain_frame.style.zIndex = "100000000";
    curtain_frame.style.border = "0px";
    curtain_frame.style.padding = "0px";
    curtain_frame.style.margin = "0px";
    curtain_frame.style.backgroundColor = "transparent";
    curtain_frame.srcdoc = "<!DOCTYPE html>";
    document.body.appendChild(curtain_frame);

    curtain_frame.onload = () => {
        //> body as curtain
        curtain = curtain_frame.contentDocument.body;
        curtain.style.height = get_page_height() + "px";
        curtain.style.width = get_page_width() + "px";
        curtain.style.border = "0px";
        curtain.style.padding = "0px";
        curtain.style.margin = "0px";
        curtain.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        curtain.style.cursor = "crosshair"
        curtain.addEventListener("mousedown", drag_select_begin);
        curtain.addEventListener("mousemove", drag_selecting);
        curtain.addEventListener("mouseup", drag_select_end);

        //> selection highlight
        highlight = new SelectionHighlight();
        // highlight.constructor();
    };
}

function setup_btns_html_elements() {
    //> cancel_btn frame
    cancel_btn_frame = document.createElement("iframe");
    cancel_btn_frame.id = "qrshot_cancel_btn_frame";
    cancel_btn_frame.style.position = "fixed";
    cancel_btn_frame.style.left = "40%";
    cancel_btn_frame.style.bottom = "5%";
    cancel_btn_frame.style.width = "20%";
    cancel_btn_frame.style.height = "7%";
    cancel_btn_frame.style.zIndex = "100000002";
    cancel_btn_frame.style.border = "0px";
    cancel_btn_frame.style.padding = "0px";
    cancel_btn_frame.style.margin = "0px";
    cancel_btn_frame.style.backgroundColor = "transparent";
    cancel_btn_frame.srcdoc = "<!DOCTYPE html>";
    document.body.appendChild(cancel_btn_frame);

    cancel_btn_frame.onload = () => {
        //> button frame css
        let css_style = document.createElement("style");
        css_style.innerText = '.qrshot_btn {position: absolute;background-color: rgba(255, 255, 255, 0.25);\
            color: azure;font-size: 18px;font-family: sans-serif;font-weight: normal;\
            border: 1px rgba(255, 255, 255, 0.7);min-height: 22px;min-width: 5px;\
            border: solid rgba(255, 255, 255, 0.5) thin;cursor: default;}\
            body{height: 100%; width: 100%; border=0px; padding: 0px;margin: 0px;\
            background-color: transparent;} .qrshot_btn:hover {background-color: rgba(255, 255, 255, 0.6);}';
        cancel_btn_frame.contentDocument.head.appendChild(css_style);

        //> append cancel button
        cancel_btn_frame.contentDocument.body.appendChild(cancel_btn);
    };

    cancel_btn = document.createElement("button");
    cancel_btn.id = "qrshot_cancel_btn";
    cancel_btn.classList.add("qrshot_btn");
    cancel_btn.style.left = "0px";
    cancel_btn.style.top = "0px";
    cancel_btn.style.width = "100%";
    cancel_btn.style.height = "100%";
    cancel_btn.addEventListener("click", cancel_btn_clicked);
    cancel_btn.addEventListener("mouseenter", () => { is_on_certain_button = true; });
    cancel_btn.addEventListener("mouseleave", () => { is_on_certain_button = false; });
    cancel_btn.innerText = "Cancel";


    //> again button
    again_btn_frame = document.createElement("iframe");
    again_btn_frame.id = "qrshot_again_btn_frame";
    again_btn_frame.style.position = "fixed";
    again_btn_frame.style.right = "23%";
    again_btn_frame.style.bottom = "5%";
    again_btn_frame.style.width = "20%";
    again_btn_frame.style.height = "7%";
    again_btn_frame.style.zIndex = "100000002";
    again_btn_frame.style.border = "0px";
    again_btn_frame.style.padding = "0px";
    again_btn_frame.style.margin = "0px";
    again_btn_frame.style.backgroundColor = "transparent";
    again_btn_frame.srcdoc = "<!DOCTYPE html>";
    document.body.appendChild(again_btn_frame);

    again_btn_frame.onload = () => {
        //> button frame css
        let css_style = document.createElement("style");
        css_style.innerText = '.qrshot_btn {position: absolute;background-color: rgba(255, 255, 255, 0.25);\
            color: azure;font-size: 18px;font-family: sans-serif;font-weight: normal;\
            border: 1px rgba(255, 255, 255, 0.7);min-height: 22px;min-width: 5px;\
            border: solid rgba(255, 255, 255, 0.5) thin;cursor: default;}\
            body{height: 100%; width: 100%; border=0px; padding: 0px;margin: 0px;\
            background-color: transparent;} .qrshot_btn:hover {background-color: rgba(255, 255, 255, 0.6);}';
        again_btn_frame.contentDocument.head.appendChild(css_style);

        //> append again button
        again_btn_frame.contentDocument.body.appendChild(again_btn);
        again_btn_frame.hidden = true;
    };

    again_btn = document.createElement("button");
    again_btn.id = "qrshot_again_btn";
    again_btn.style.right = "0px";
    again_btn.style.top = "0px";
    again_btn.style.width = "100%";
    again_btn.style.height = "100%";
    again_btn.classList.add("qrshot_btn");
    again_btn.addEventListener("click", again_btn_clicked);
    again_btn.addEventListener("mouseenter", () => { is_on_certain_button = true; });
    again_btn.addEventListener("mouseleave", () => { is_on_certain_button = false; });
    again_btn.innerText = "Again";
}

function setup_result_frame_html_elements() {
    result_frame = document.createElement("iframe");
    result_frame.id = "qrshot_result_frame";
    result_frame.style.position = "absolute";
    result_frame.style.left = "0px";
    result_frame.style.top = "0px";
    result_frame.style.width = "322px";
    result_frame.style.height = "124px";
    result_frame.style.zIndex = "100000006";
    result_frame.style.border = "0px";
    result_frame.style.padding = "0px";
    result_frame.style.margin = "0px";
    result_frame.style.backgroundColor = "transparent";
    result_frame.srcdoc = "<!DOCTYPE html>";
    document.body.appendChild(result_frame);

    result_frame.onload = () => {
        //> css
        let css_style = document.createElement("style");
        css_style.innerText = "#qrshot_result_board {position: absolute;background-color: rgb(10, 10, 10);\
            width: 300px;padding: 10px;border-width: 1px;border-style: solid;\
            border-color: rgba(255, 255, 255, 0.7);display: flex;flex-direction: column;cursor: default;\
            margin: initial;}.qrshot_result_line_container {display: flex;width: 100%;}\
            input#qrshot_result_text_field {background-color: rgb(30, 30, 30);color: rgb(200, 200, 200);\
            border-style: none;font-size: 15px;font-family: sans-serif;font-weight: normal;width: 100%;\
            height: 30px;margin: 10px;flex-grow: 1;}\
            input#qrshot_result_text_field:focus {background-color: rgb(50, 50, 50);}\
            button.qrshot_result_board_btns {position: relative;background-color: rgba(255, 255, 255, 0.25);\
            color: azure;border: 1px rgba(255, 255, 255, 0.7);height: 30px;font-size: 15px;\
            font-family: sans-serif;font-weight: normal;border: solid rgba(255, 255, 255, 0.5) thin;\
            margin: 10px;flex-grow: 1;min-width: min-content;max-width: none;cursor: default;}\
            button.qrshot_result_board_btns:hover {background-color: rgba(255, 255, 255, 0.6);}\
            button.qrshot_result_board_btns:disabled {background-color: rgba(0, 0, 0, 0.6);\
            color: darkslategrey;border: none;}button#qrshot_result_close_btn {position: absolute;top: 0px;\
            left: 0px;width: 20px;height: 20px;background-color: rgba(255, 112, 102, 0.8);color: azure;\
            font-size: 15px;font-family: sans-serif;font-weight: normal;border: none;min-width: min-content;\
            max-width: none;cursor: default;}button#qrshot_result_close_btn:hover {\
            background-color: rgba(255, 43, 28, 0.8);}";
        result_frame.contentDocument.head.appendChild(css_style);


        //> result board
        result_board = result_frame.contentDocument.body;
        result_board.id = "qrshot_result_board";
        result_frame.hidden = true;

        // result_board.addEventListener("mousedown", result_board_drag_begin);
        // result_board.addEventListener("mousemove", result_board_dragging);
        // result_board.addEventListener("mouseup", result_board_drag_end);
        // result_frame.draggable = true;

        result_board.appendChild(result_line_container_up);
        result_board.appendChild(result_line_container_down);
        result_board.appendChild(result_close_btn);
    }


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

    // curtain.appendChild(result_board);
}

function remove_all_qrshot_elements() {
    let r1 = document.getElementById("qrshot_curtain_frame");
    let r2 = document.getElementById("qrshot_result_frame");
    let r3 = document.getElementById("qrshot_cancel_btn_frame");
    let r4 = document.getElementById("qrshot_again_btn_frame");
    if (r1 != null || r2 != null || r3 != null || r4 != null) {
        if (r1 != null) document.body.removeChild(r1);
        if (r2 != null) document.body.removeChild(r2);
        if (r3 != null) document.body.removeChild(r3);
        if (r4 != null) document.body.removeChild(r4);
    }
    browser.runtime.onMessage.removeListener(msg_handler);
    clearInterval(root_highlight_resize_interval);
}

start();