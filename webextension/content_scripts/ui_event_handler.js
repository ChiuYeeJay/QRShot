function cancel_btn_clicked() {
    document.body.removeChild(document.getElementById("qrshot_root_element"));
}

function again_btn_clicked() {
    highlight.hide();
    highlight.left = 0;
    highlight.width = 0;
    highlight.top = 0;
    highlight.height = 0;
    highlight.evaluate_position_and_size();
    root.removeChild(again_btn);
    root.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    root.style.cursor = "crosshair"
    if (document.getElementById("qrshot_result_board")) root.removeChild(result_board);
    if (result_copy_btn.style.backgroundColor) result_copy_btn.style.removeProperty("background-color");
    cancel_btn.style.left = "40%";
    dont_start_select = false;
    is_on_certain_button = false;
}

// result_go_btn or result_newtab_btn clicked
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

// called when mouse down on root element
function drag_select_begin(e) {
    if (dont_start_select || is_on_certain_button) return;
    // console.log(e);
    is_dragging = true;
    disable_scroll();
    mouse_start_screen_pos = [e.clientX, e.clientY];
    mouse_start_pos = [e.pageX, e.pageY];
    highlight.left = mouse_start_pos[0];
    highlight.top = mouse_start_pos[1];
    highlight.width = 0;
    highlight.height = 0;
    highlight.color = "rgba(150, 200, 255, 0.6)";
    highlight.show();
    root.style.backgroundColor = "transparent";
    root.removeChild(cancel_btn);
}

// called when mouse move on root element
function drag_selecting(e) {
    if (!is_dragging) return;
    if (mouse_start_pos[0] < e.pageX) {
        highlight.left = mouse_start_pos[0];
        highlight.width = e.pageX - mouse_start_pos[0];
    } else {
        highlight.left = e.pageX;
        highlight.width = mouse_start_pos[0] - e.pageX;
    }
    if (mouse_start_pos[1] < e.pageY) {
        highlight.top = mouse_start_pos[1];
        highlight.height = e.pageY - mouse_start_pos[1];
    } else {
        highlight.top = e.pageY;
        highlight.height = mouse_start_pos[1] - e.pageY;
    }
    highlight.evaluate_position_and_size();
}

// called when mouse up on root element
function drag_select_end(e) {
    if (!is_dragging) return;
    // console.log(e);
    is_dragging = false;
    if (mouse_start_pos[0] == e.pageX || mouse_start_pos[0] == e.pageY) {
        root.appendChild(cancel_btn);
        return;
    }
    dont_start_select = true;

    cancel_btn.style.left = "23%"
    root.appendChild(cancel_btn);
    root.appendChild(again_btn);

    let offset = [0, 0];
    let cv_sz = [0, 0];
    if (mouse_start_pos[0] < e.pageX) {
        offset[0] = mouse_start_screen_pos[0];
        cv_sz[0] = e.clientX - offset[0];
        highlight_lefttop[0] = mouse_start_pos[0];
    } else {
        offset[0] = e.clientX;
        cv_sz[0] = mouse_start_screen_pos[0] - offset[0];
        highlight_lefttop[0] = e.pageX;
    }
    if (mouse_start_pos[1] < e.pageY) {
        offset[1] = mouse_start_screen_pos[1];
        cv_sz[1] = e.clientY - offset[1];
        highlight_lefttop[1] = mouse_start_pos[1];
    } else {
        offset[1] = e.clientY;
        cv_sz[1] = mouse_start_screen_pos[1] - offset[1];
        highlight_lefttop[1] = e.pageY;
    }
    highlight.color = "transparent";

    // console.log([mouse_start_screen_pos, [e.clientX, e.clientY], offset]);

    // document.body.removeChild(root);
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