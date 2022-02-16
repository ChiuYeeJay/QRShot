function cancel_btn_clicked() {
    // document.body.removeChild(ab_root_frame);
    // document.body.removeChild(fx_root_frame);
    remove_all_qrshot_elements();
}

function again_btn_clicked() {
    highlight.hide();
    highlight.left = 0;
    highlight.width = 0;
    highlight.top = 0;
    highlight.height = 0;
    highlight.evaluate_position_and_size();
    again_btn_frame.hidden = true;
    ab_root.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    ab_root.style.cursor = "crosshair"
    if (!result_frame.hidden) result_frame.hidden = true;
    if (result_copy_btn.style.backgroundColor) result_copy_btn.style.removeProperty("background-color");
    cancel_btn_frame.style.left = "40%";
    dont_start_select = false;
    is_on_certain_button = false;
}

// result_go_btn or result_newtab_btn clicked
function result_go_tab_btn_clicked(type) {
    browser.runtime.sendMessage({ msg_type: ("url_" + type), data: result_text_field.value });
    remove_all_qrshot_elements();
}

function result_copy_btn_clicked() {
    navigator.clipboard.writeText(result_text_field.value);
    result_copy_btn.style.backgroundColor = "rgba(100, 255, 100, 0.4)";
}

function result_close_btn_clicked() {
    // document.body.removeChild(ab_root_frame);
    // document.body.removeChild(fx_root_frame);
    // Document.body.removeChild(result_frame);
    remove_all_qrshot_elements();
}

// called when mouse down on root element
function drag_select_begin(e) {
    if (dont_start_select || is_on_certain_button) return;
    // console.log(e);
    is_dragging = true;
    dont_start_select = true;
    mouse_start_screen_pos = [e.clientX, e.clientY];
    mouse_start_pos = [e.pageX, e.pageY];
    highlight.left = mouse_start_pos[0];
    highlight.top = mouse_start_pos[1];
    highlight.width = 0;
    highlight.height = 0;
    highlight.color = "rgba(150, 200, 255, 0.6)";
    highlight.show();
    ab_root.style.backgroundColor = "transparent";
    cancel_btn_frame.hidden = true;
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
        cancel_btn_frame.hidden = false;
        dont_start_select = false;
        return;
    }

    cancel_btn_frame.hidden = false;

    let cv_sz = [0, 0];
    if (mouse_start_pos[0] < e.pageX) {
        highlight_lefttop[0] = mouse_start_pos[0];
        cv_sz[0] = e.pageX - highlight_lefttop[0];
    } else {
        highlight_lefttop[0] = e.pageX;
        cv_sz[0] = mouse_start_screen_pos[0] - highlight_lefttop[0];
    }
    if (mouse_start_pos[1] < e.pageY) {
        highlight_lefttop[1] = mouse_start_pos[1];
        cv_sz[1] = e.pageY - highlight_lefttop[1];
    } else {
        highlight_lefttop[1] = e.pageY;
        cv_sz[1] = mouse_start_screen_pos[1] - highlight_lefttop[1];
    }
    highlight.color = "transparent";

    // console.log([mouse_start_screen_pos, [e.clientX, e.clientY], offset]);

    // document.body.removeChild(root);
    let data = {
        x: highlight_lefttop[0],
        y: highlight_lefttop[1],
        width: cv_sz[0],
        height: cv_sz[1],
    }
    browser.runtime.sendMessage({ msg_type: "qrcode_decode", data: data });
}