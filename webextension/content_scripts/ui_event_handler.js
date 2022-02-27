/** Being called when cancel_btn is clicked. Remove all qrshot elements*/
function cancel_btn_clicked() {
    remove_all_qrshot_elements();
}

/** Being called when again_btn is clicked. Reset ui for shooting again.*/
function again_btn_clicked() {
    //> hide highlight
    highlight.hide();
    highlight.left = 0;
    highlight.width = 0;
    highlight.top = 0;
    highlight.height = 0;
    highlight.evaluate_position_and_size();
    again_btn_frame.hidden = true;
    curtain.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    curtain.style.cursor = "crosshair";

    //> hide result board
    if (!result_frame.hidden) result_frame.hidden = true;
    if (result_copy_btn.style.backgroundColor) result_copy_btn.style.removeProperty("background-color");
    cancel_btn_frame.style.left = "40%";

    //> enable selecting
    dont_start_select = false;
    is_on_certain_button = false;
}

/** 
 * Being called when result_go_btn or result_newtab_btn is clicked. Send message to background to open the url, and then remove all qrshot elements.
 * @param {string} type "go" or "newtab"
 */
function result_go_tab_btn_clicked(type) {
    browser.runtime.sendMessage({ msg_type: ("url_" + type), data: result_text_field.value });
    remove_all_qrshot_elements();
}

/** Being called when the result_copy_btn is clicked. Copy the content in textfiled to clipboard. */
function result_copy_btn_clicked() {
    navigator.clipboard.writeText(result_text_field.value);
    result_copy_btn.style.backgroundColor = "rgba(100, 255, 100, 0.4)";
}

/** Being called when the close button on result board is clicked. Remove all qrshot elements. */
function result_close_btn_clicked() {
    remove_all_qrshot_elements();
}

/**  Being called when mouse down on curtain element. Start slelecting.
 * @param {MouseEvent} e mouse event.
 */
function drag_select_begin(e) {
    if (dont_start_select || is_on_certain_button || e.button != 0) return;
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
    curtain.style.backgroundColor = "transparent";
    cancel_btn_frame.hidden = true;
}

/** Being called when mouse move on curtain element.
 * @param {MouseEvent} e mouse event.
 */
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

/** Being called when mouse up on curtain element. Send the rectangle position to background to decode.
 * @param {MouseEvent} e mouse event.
 */
function drag_select_end(e) {
    if (!is_dragging) return;
    is_dragging = false;

    //> Cancel selecting if the recatangle area is 0
    if (mouse_start_pos[0] == e.pageX || mouse_start_pos[0] == e.pageY) {
        cancel_btn_frame.hidden = false;
        dont_start_select = false;
        return;
    }

    //> decide the rectangle position
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

    //> send to background
    highlight.color = "transparent";
    let data = {
        x: highlight_lefttop[0],
        y: highlight_lefttop[1],
        width: cv_sz[0],
        height: cv_sz[1],
    }
    browser.runtime.sendMessage({ msg_type: "qrcode_decode", data: data });
}

// function result_board_drag_begin(event) {
//     is_result_board_dragging = true;
//     rb_drag_init_pos = [event.clientX, event.clientY];
//     result_frame.style.border = "1px white";
// }

// var rb_drag_init_pos;

// function result_board_dragging(event) {
//     if (!is_result_board_dragging) return;
//     result_frame.style.left = parseInt(result_frame.style.left, 10) + event.clientX - rb_drag_init_pos[0] + "px";
//     result_frame.style.top = parseInt(result_frame.style.top, 10) + event.clientY - rb_drag_init_pos[1] + "px";
// }

// function result_board_drag_end(event) {
//     is_result_board_dragging = false;
//     result_frame.style.border = "0px";
// }