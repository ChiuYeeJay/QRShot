/** Recive the messages and call different function by the type of messages.
 * @param {object} msg
 */
function msg_handler(msg) {
    if (msg.type == "decode_result") {
        receive_result_from_background(msg.data);
    } else if (msg.type == "error_report") {
        something_wrong_from_background(msg.data);
    } else if (msg.type == "return_capture_img") {
        receive_captured_screenshot(msg.data);
    }
}

/** Recieve the result of decoding QR code. Set the UI based on sucess.
 * @param {object} decoded decoded content of the QR code
 */
function receive_result_from_background(decoded) {
    curtain.style.cursor = "default";
    cancel_btn.style.left = "23%"
    again_btn.hidden = false;
    cancel_btn.hidden = false;
    if (decoded) {
        let location = decoded.location;
        //> green highlight
        let relative_left = Math.min(location.topLeftCorner.x, location.topRightCorner.x, location.bottomLeftCorner.x, location.bottomRightCorner.x);
        let relative_right = Math.max(location.topLeftCorner.x, location.topRightCorner.x, location.bottomLeftCorner.x, location.bottomRightCorner.x);
        let relative_top = Math.min(location.topLeftCorner.y, location.bottomLeftCorner.y, location.topRightCorner.y, location.bottomRightCorner.y);
        let relative_bottom = Math.max(location.topLeftCorner.y, location.bottomLeftCorner.y, location.topRightCorner.y, location.bottomRightCorner.y);
        let highlight_padding = (relative_right - relative_left) * 0.05;

        highlight.left = highlight_lefttop[0] + relative_left - highlight_padding;
        highlight.top = highlight_lefttop[1] + relative_top - highlight_padding;
        highlight.width = relative_right - relative_left + 2 * highlight_padding;
        highlight.height = relative_bottom - relative_top + 2 * highlight_padding;
        highlight.color = "rgba(200, 255, 150, 0.6)";
        highlight.evaluate_position_and_size();

        //> result board
        let is_url = decoded.data.startsWith("http://") || decoded.data.startsWith("https://");
        result_text_field.value = decoded.data;
        result_text_field.disabled = is_url;
        result_text_field.style.cursor = is_url ? "default" : "text";
        result_go_btn.disabled = !is_url;
        result_newtab_btn.disabled = !is_url;
        if (curtain.clientHeight - (highlight_lefttop[1] + relative_bottom) - highlight_padding > 120) {
            result_board.style.top = (highlight_lefttop[1] + relative_bottom) + highlight_padding + 2 + "px";
            if (result_board.style.bottom) result_board.style.removeProperty("bottom");
        } else {
            if (result_board.style.top) result_board.style.removeProperty("top");
            result_board.style.bottom = "0px";
        }
        if (curtain.clientWidth - (highlight_lefttop[0] + relative_left - highlight_padding) > 272) {
            result_board.style.left = highlight_lefttop[0] + relative_left - highlight_padding + "px";
            if (result_board.style.right) result_board.style.removeProperty("right");
        } else {
            result_board.style.right = "0px";
            if (result_board.style.left) result_board.style.removeProperty("left");
        }
        result_board.hidden = false;
    } else {
        console.log("fail to recognize qrcode");
        highlight.color = "rgba(255, 150, 150, 0.6)";
    }
}

/** Receive the img src of the screen shooting. (debugging usage)
 * @param {string} data image src 
 */
function receive_captured_screenshot(data) {
    let img_elm = document.createElement("img");
    img_elm.src = data;
    img_elm.onload = () => {
        document.body.appendChild(img_elm);
    }
}

/** Receive error message.
 * @param {string} error_str error description.
 */
function something_wrong_from_background(error_str) {
    alert("qrshot error: " + error_str);
    remove_all_qrshot_elements()
}