/**
    When the toolbar button is clicked, the function will be called.
    - If there are some qrshot elements on the page, it removes all qrshot elements and listener.
    - Otherwise, it will setup all qrshot elements and message listener.
*/
function start() {
    if (document.getElementById("qrshot_host") != null) {    
        let host = document.getElementById("qrshot_host");
        document.body.removeChild(host);
        browser.runtime.onMessage.removeListener(msg_handler);
        clearInterval(curtain_highlight_resize_interval);
    } else {
        setup_root_html_elements();
        setup_curtain_html_elements();
        setup_btns_html_elements();
        setup_result_board_html_elements();
        browser.runtime.onMessage.addListener(msg_handler);
        curtain_highlight_resize_interval = setInterval(curtain_highlight_resize, 2000);
    }
}

//> qrshot elements
var root
var curtain;
var cancel_btn;
var again_btn;
var result_board;
var result_text_field;
var result_go_btn;
var result_newtab_btn;
var result_copy_btn;

//> about selecting and result board
var is_dragging = false;
var dont_start_select = false;
var is_on_certain_button = false;
var highlight;
var mouse_start_pos;
var mouse_start_screen_pos;
var highlight_lefttop = [0, 0];
// var is_result_board_dragging = false;

//> the interval number to resize curtain size
var curtain_highlight_resize_interval;

/** Setup shadowroot and root.element*/
function setup_root_html_elements(){
    let host = document.createElement("div")
    document.body.appendChild(host)
    host.id = "qrshot_host"
    root = host.attachShadow({mode: 'open'});
}

/** Setup curtain iframe and the elements inside.*/
function setup_curtain_html_elements() {
    //> curtain
    curtain = document.createElement("div");
    curtain.id = "qrshot_curtain"
    curtain.style.height = get_page_height() + "px";
    curtain.style.width = get_page_width() + "px";
    curtain.style.position = "absolute";
    curtain.style.top = "0px";
    curtain.style.left = "0px";
    curtain.style.zIndex = "100000000";
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
    root.appendChild(curtain);
}

/** Setup cancel_btn and again_btn iframe and the button elements inside.*/
function setup_btns_html_elements() {
    //> cancel button
    cancel_btn = document.createElement("button");
    cancel_btn.id = "qrshot_cancel_btn";
    cancel_btn.classList.add("qrshot_btn");
    cancel_btn.style.position = "fixed";
    cancel_btn.style.left = "40%";
    cancel_btn.style.bottom = "5%";
    cancel_btn.style.width = "20%";
    cancel_btn.style.height = "7%";
    cancel_btn.style.zIndex = "100000002";
    cancel_btn.addEventListener("click", cancel_btn_clicked);
    cancel_btn.addEventListener("mouseenter", () => { is_on_certain_button = true; });
    cancel_btn.addEventListener("mouseleave", () => { is_on_certain_button = false; });
    cancel_btn.innerText = "Cancel";
    root.appendChild(cancel_btn);

    //> again button
    again_btn = document.createElement("button");
    again_btn.id = "qrshot_again_btn";
    again_btn.style.position = "fixed";
    again_btn.style.right = "23%";
    again_btn.style.bottom = "5%";
    again_btn.style.width = "20%";
    again_btn.style.height = "7%";
    again_btn.style.zIndex = "100000002";
    again_btn.classList.add("qrshot_btn");
    again_btn.addEventListener("click", again_btn_clicked);
    again_btn.addEventListener("mouseenter", () => { is_on_certain_button = true; });
    again_btn.addEventListener("mouseleave", () => { is_on_certain_button = false; });
    again_btn.innerText = "Again";
    again_btn.hidden = true;
    root.appendChild(again_btn);

    //> button style
    let btn_style = document.createElement("style");
    btn_style.id = "qrshot_btn_style"
    btn_style.innerText = '.qrshot_btn {position: absolute;background-color: rgba(255, 255, 255, 0.25);\
        color: azure;font-size: 18px;font-family: sans-serif;font-weight: normal;\
        border: 1px rgba(255, 255, 255, 0.7);min-height: 22px;min-width: 5px;\
        border: solid rgba(255, 255, 255, 0.5) thin;cursor: default;}\
        body{height: 100%; width: 100%; border=0px; padding: 0px;margin: 0px;\
        background-color: transparent;} .qrshot_btn:hover {background-color: rgba(255, 255, 255, 0.6);}';
    root.appendChild(btn_style);
}

/** Setup result_board iframe and the elements inside.*/
function setup_result_board_html_elements() {
    //> result board
    result_board = document.createElement("div");;
    result_board.id = "qrshot_result_board";
    result_board.style.position = "absolute";
    result_board.style.left = "0px";
    result_board.style.top = "0px";
    result_board.style.width = "300px";
    result_board.style.height = "102px";
    result_board.style.zIndex = "100000006";
    result_board.hidden = true;
    root.appendChild(result_board);

    //> text/url field
    result_text_field = document.createElement("input");
    result_text_field.id = "qrshot_result_text_field";
    result_text_field.type = "text";
    
    //> go url button
    result_go_btn = document.createElement("button");
    result_go_btn.id = "qrshot_result_go_btn";
    result_go_btn.classList.add("qrshot_result_board_btns");
    result_go_btn.innerText = "Go";
    result_go_btn.addEventListener("click", () => { result_go_tab_btn_clicked("go") });
    
    //> newtab button
    result_newtab_btn = document.createElement("button");
    result_newtab_btn.id = "qrshot_result_newtab_btn";
    result_newtab_btn.classList.add("qrshot_result_board_btns");
    result_newtab_btn.innerText = "NewTab";
    result_newtab_btn.addEventListener("click", () => { result_go_tab_btn_clicked("newtab") });
    
    //> copy button
    result_copy_btn = document.createElement("button");
    result_copy_btn.id = "qrshot_result_copy_btn";
    result_copy_btn.classList.add("qrshot_result_board_btns");
    result_copy_btn.innerText = "Copy";
    result_copy_btn.addEventListener("click", result_copy_btn_clicked);
    result_text_field.addEventListener("input", () => {
        if (result_copy_btn.style.backgroundColor) result_copy_btn.style.removeProperty("background-color");
    });
    
    //> close button
    let result_close_btn = document.createElement("button");
    result_close_btn.id = "qrshot_result_close_btn";
    result_close_btn.innerText = "X";
    result_close_btn.addEventListener("click", result_close_btn_clicked);
    result_board.appendChild(result_close_btn);
    
    //> layout elements
    let result_line_container_up = document.createElement("div");
    result_line_container_up.classList.add("qrshot_result_line_container");
    result_line_container_up.appendChild(result_text_field);
    result_board.appendChild(result_line_container_up);

    let result_line_container_down = document.createElement("div");
    result_line_container_down.classList.add("qrshot_result_line_container");
    result_line_container_down.appendChild(result_copy_btn);
    result_line_container_down.appendChild(result_go_btn);
    result_line_container_down.appendChild(result_newtab_btn);
    result_board.appendChild(result_line_container_down);
    
    // curtain.appendChild(result_board);
    //> css
    let result_board_style = document.createElement("style");
    result_board_style.innerText = "#qrshot_result_board {background-color: rgb(10, 10, 10);\
        padding: 10px;border-width: 1px;border-style: solid;border-color: rgba(255, 255, 255, 0.7);\
        cursor: default;margin: initial;display: flex;flex-direction: column;width: 300px;}\
        [hidden]{display:none !important;}\
        .qrshot_result_line_container {display: flex;width: 100%;}\
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
    root.appendChild(result_board_style);
}

/** Remove all qrshot elements on the page.*/
function remove_all_qrshot_elements() {
    if (document.getElementById("qrshot_host") != null) {
        let host = document.getElementById("qrshot_host")
        document.body.removeChild(host);
    }
    browser.runtime.onMessage.removeListener(msg_handler);
    clearInterval(curtain_highlight_resize_interval);
}

start();