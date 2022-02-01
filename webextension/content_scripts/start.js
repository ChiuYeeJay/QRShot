function start() {
    // alert("start!");
    let r = document.getElementById("qrshot_root_element");
    if (r != null) {
        document.body.removeChild(r);
    } else {
        setup_start_html_elements();
    }
}

function cancel_btn_clicked() {
    // alert("cancel!");
    document.body.removeChild(document.getElementById("qrshot_root_element"));
}

function setup_start_html_elements() {
    var root = document.createElement("div");
    root.id = "qrshot_root_element";

    let just_drag_txt = document.createElement("p");
    just_drag_txt.id = "just_drag_txt";
    just_drag_txt.innerText = "Just Drag";
    root.appendChild(just_drag_txt);

    let cancel_btn = document.createElement("button");
    cancel_btn.id = "qrshot_cancel_btn";
    cancel_btn.classList.add("qrshot_btn");
    cancel_btn.addEventListener("click", cancel_btn_clicked);
    cancel_btn.innerText = "Cancel";
    root.appendChild(cancel_btn);
    document.body.appendChild(root);
}

start();