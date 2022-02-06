function root_highlight_resize() {
    root.style.height = get_page_height() + "px";
    root.style.width = get_page_width() + "px";
    highlight.evaluate_position_and_size();
}

function get_page_height() {
    return Math.max(document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
    );
}

function get_page_width() {
    return Math.max(document.body.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.clientWidth,
        document.documentElement.scrollWidth,
        document.documentElement.offsetWidth
    );
}