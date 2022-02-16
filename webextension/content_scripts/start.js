function start() {
    let r = document.getElementById("qrshot_root_element");
    if (r != null) {
        document.body.removeChild(r);
        browser.runtime.onMessage.removeListener(msg_handler);
        clearInterval(root_highlight_resize_interval);
    } else {
        setup_start_html_elements();
        browser.runtime.onMessage.addListener(msg_handler);
        root_highlight_resize_interval = setInterval(root_highlight_resize, 2000);
    }
}

var root;
var root_frame;
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
var highlight;
var mouse_start_pos;
var mouse_start_screen_pos;
var highlight_lefttop = [0, 0];

var root_highlight_resize_interval;

function setup_start_html_elements() {
    //> root frame/node
    root_frame = document.createElement("iframe");
    root_frame.id = "qrshot_root_element";
    root_frame.style.height = get_page_height() + "px";
    root_frame.style.width = get_page_width() + "px";
    root_frame.style.position = "absolute";
    root_frame.style.top = "0px";
    root_frame.style.left = "0px";
    root_frame.style.zIndex = "100000000";
    root_frame.style.border = "none";
    root_frame.style.padding = "none";
    root_frame.style.margin = "none";
    root_frame.style.backgroundColor = "transparent";
    root_frame.srcdoc = " ";
    document.body.appendChild(root_frame);
    root_frame.onload = () => {

        let css_link = root_frame.contentDocument.createElement("link");
        css_link.rel = "stylesheet";
        css_link.href = browser.runtime.getURL("qrshot_style.css");
        root_frame.contentDocument.head.appendChild(css_link);

        root = root_frame.contentDocument.body;
        root.style.height = get_page_height() + "px";
        root.style.width = get_page_width() + "px";
        root.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        root.style.cursor = "crosshair"
        root.addEventListener("mousedown", drag_select_begin);
        root.addEventListener("mousemove", drag_selecting);
        root.addEventListener("mouseup", drag_select_end);
        // root_frame.contentDocument.body.appendChild(root);


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

        //> selection highlight
        highlight = new SelectionHighlight();
        // highlight.constructor();

        //> result board
        result_board = document.createElement("div");
        result_board.id = "qrshot_result_board";

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
        // document.body.appendChild(root_frame);
    };
}

start();