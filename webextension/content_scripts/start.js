function start() {
    let r1 = document.getElementById("qrshot_ab_root_frame");
    let r2 = document.getElementById("qrshot_fx_root_frame");
    let r3 = document.getElementById("qrshot_result_frame");

    if (r1 != null || r2 != null || r3 != null) {
        if (r1 != null) document.body.removeChild(r1);
        if (r2 != null) document.body.removeChild(r2);
        if (r3 != null) document.body.removeChild(r3);
        browser.runtime.onMessage.removeListener(msg_handler);
        clearInterval(root_highlight_resize_interval);
    } else {
        setup_ab_root_html_elements();
        setup_fx_root_html_elements();
        setup_result_frame_html_elements();
        browser.runtime.onMessage.addListener(msg_handler);
        root_highlight_resize_interval = setInterval(root_highlight_resize, 2000);
    }
}

var ab_root;
var ab_root_frame;
var fx_root;
var fx_root_frame;

var cancel_btn;
var again_btn;

var result_frame;
var result_board;
var result_text_field
var result_go_btn
var result_newtab_btn
var result_copy_btn

var is_dragging = false;
var dont_start_select = false;
var is_on_certain_button = false;
var highlight;
var mouse_start_pos;
var mouse_start_screen_pos;
var highlight_lefttop = [0, 0];

var root_highlight_resize_interval;

function setup_ab_root_html_elements() {
    //> ab_root frame
    ab_root_frame = document.createElement("iframe");
    ab_root_frame.id = "qrshot_ab_root_frame";
    ab_root_frame.style.height = get_page_height() + "px";
    ab_root_frame.style.width = get_page_width() + "px";
    ab_root_frame.style.position = "absolute";
    ab_root_frame.style.top = "0px";
    ab_root_frame.style.left = "0px";
    ab_root_frame.style.zIndex = "100000000";
    ab_root_frame.style.border = "none";
    ab_root_frame.style.padding = "none";
    ab_root_frame.style.margin = "none";
    ab_root_frame.style.backgroundColor = "transparent";
    ab_root_frame.srcdoc = " ";
    document.body.appendChild(ab_root_frame);

    ab_root_frame.onload = () => {
        //> ab_root frame css
        let css_link = ab_root_frame.contentDocument.createElement("link");
        css_link.rel = "stylesheet";
        css_link.href = browser.runtime.getURL("qrshot_style.css");
        ab_root_frame.contentDocument.head.appendChild(css_link);

        //> body as ab_root
        ab_root = ab_root_frame.contentDocument.body;
        ab_root.style.height = get_page_height() + "px";
        ab_root.style.width = get_page_width() + "px";
        ab_root.style.border = "none";
        ab_root.style.padding = "none";
        ab_root.style.margin = "none";
        ab_root.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        ab_root.style.cursor = "crosshair"
        ab_root.addEventListener("mousedown", drag_select_begin);
        ab_root.addEventListener("mousemove", drag_selecting);
        ab_root.addEventListener("mouseup", drag_select_end);

        //> selection highlight
        highlight = new SelectionHighlight();
        // highlight.constructor();

        //> append cancel button
        ab_root.appendChild(cancel_btn);
    };
}

function setup_fx_root_html_elements() {
    //> fx_root frame
    fx_root_frame = document.createElement("iframe");
    fx_root_frame.id = "qrshot_fx_root_frame";
    fx_root_frame.style.position = "fixed";
    fx_root_frame.style.left = "0px";
    fx_root_frame.style.top = "0px";
    fx_root_frame.style.width = "100vw";
    fx_root_frame.style.height = "100vh";
    fx_root_frame.style.zIndex = "100000002";
    fx_root_frame.style.border = "0px";
    fx_root_frame.style.padding = "0px";
    fx_root_frame.style.margin = "0px";
    fx_root_frame.style.backgroundColor = "transparent";
    fx_root_frame.srcdoc = " ";
    document.body.appendChild(fx_root_frame);

    fx_root_frame.onload = () => {
        //> fx_root frame css
        let css_link = ab_root_frame.contentDocument.createElement("link");
        css_link.rel = "stylesheet";
        css_link.href = browser.runtime.getURL("qrshot_style.css");
        fx_root_frame.contentDocument.head.appendChild(css_link);

        //> body as fx_root
        fx_root = fx_root_frame.contentDocument.body;
        fx_root.style.height = "100vh";
        fx_root.style.width = "100vw";
        fx_root.style.border = "0px";
        fx_root.style.padding = "0px";
        fx_root.style.margin = "0px";
        fx_root.style.backgroundColor = "transparent";
        fx_root.addEventListener("mousedown", drag_select_begin);
        // fx_root.addEventListener("mousemove", drag_selecting);
        // fx_root.addEventListener("mouseup", drag_select_end);

        //> append cancel button
        fx_root.appendChild(cancel_btn);
    };

    //> cancel button
    cancel_btn = document.createElement("button");
    cancel_btn.id = "qrshot_cancel_btn";
    cancel_btn.classList.add("qrshot_btn");
    cancel_btn.style.left = "40%";
    cancel_btn.addEventListener("click", cancel_btn_clicked);
    cancel_btn.addEventListener("mouseenter", () => { is_on_certain_button = true; });
    cancel_btn.addEventListener("mouseleave", () => { is_on_certain_button = false; });
    cancel_btn.innerText = "Cancel";

    //> again button
    again_btn = document.createElement("button");
    again_btn.id = "qrshot_again_btn";
    again_btn.style.right = "23%";
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
    result_frame.srcdoc = " ";
    document.body.appendChild(result_frame);

    result_frame.onload = () => {
        //> css
        let css_link = ab_root_frame.contentDocument.createElement("link");
        css_link.rel = "stylesheet";
        css_link.href = browser.runtime.getURL("qrshot_style.css");
        result_frame.contentDocument.head.appendChild(css_link);

        //> result board
        result_board = result_frame.contentDocument.body;
        result_board.id = "qrshot_result_board";
        result_frame.hidden = true;

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

    // ab_root.appendChild(result_board);
}

function remove_all_qrshot_elements() {
    let r1 = document.getElementById("qrshot_ab_root_frame");
    let r2 = document.getElementById("qrshot_fx_root_frame");
    let r3 = document.getElementById("qrshot_result_frame");
    if (r1 != null) document.body.removeChild(r1);
    if (r2 != null) document.body.removeChild(r2);
    if (r3 != null) document.body.removeChild(r3);
    browser.runtime.onMessage.removeListener(msg_handler);
    clearInterval(root_highlight_resize_interval);
}

start();