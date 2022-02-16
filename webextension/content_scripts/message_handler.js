function msg_handler(msg) {
    if (msg.msg_type == "decode_result") {
        receive_result_from_background(msg.data);
    } else if (msg.msg_type == "error_report") {
        something_wrong_from_background(msg.data);
    }
}

function receive_result_from_background(decoded) {
    ab_root.style.cursor = "default";
    cancel_btn.style.left = "23%"
    fx_root.appendChild(again_btn);
    if (decoded) {
        //> green highlight
        let highlight_padding = (decoded.location.bottomRightCorner.x - decoded.location.topLeftCorner.x) * 0.05;
        highlight.left = highlight_lefttop[0] + decoded.location.topLeftCorner.x - highlight_padding;
        highlight.top = highlight_lefttop[1] + decoded.location.topLeftCorner.y - highlight_padding;
        highlight.width = decoded.location.bottomRightCorner.x - decoded.location.topLeftCorner.x + 2 * highlight_padding;
        highlight.height = decoded.location.bottomRightCorner.y - decoded.location.topLeftCorner.y + 2 * highlight_padding;
        highlight.color = "rgba(200, 255, 150, 0.6)";
        highlight.evaluate_position_and_size();

        //> result board
        let is_url = decoded.data.startsWith("http://") || decoded.data.startsWith("https://");
        result_text_field.value = decoded.data;
        result_text_field.disabled = is_url;
        result_go_btn.disabled = !is_url;
        result_newtab_btn.disabled = !is_url;
        if (ab_root.clientHeight - (highlight_lefttop[1] + decoded.location.bottomRightCorner.y) - highlight_padding > 120) {
            result_frame.style.top = (highlight_lefttop[1] + decoded.location.bottomRightCorner.y) + highlight_padding + 2 + "px";
            if (result_frame.style.bottom) result_frame.style.removeProperty("bottom");
        } else {
            if (result_frame.style.top) result_frame.style.removeProperty("top");
            result_frame.style.bottom = "0px";
        }
        if (ab_root.clientWidth - (highlight_lefttop[0] + decoded.location.topLeftCorner.x - highlight_padding) > 272) {
            result_frame.style.left = highlight_lefttop[0] + decoded.location.topLeftCorner.x - highlight_padding + "px";
            if (result_frame.style.right) result_frame.style.removeProperty("right");
        } else {
            result_frame.style.right = "0px";
            if (result_frame.style.left) result_frame.style.removeProperty("left");
        }
        result_frame.hidden = false;
    } else {
        console.log("fail to recognize qrcode");
        highlight.color = "rgba(255, 150, 150, 0.6)";
    }
}

function something_wrong_from_background(error_str) {
    alert("qrshot error: " + error_str);
    let r1 = document.getElementById("qrshot_ab_root_frame");
    let r2 = document.getElementById("qrshot_fx_root_frame");
    if (r1 != null) document.body.removeChild(r1);
    if (r2 != null) document.body.removeChild(r2);
}