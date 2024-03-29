/** resize the curtain iframe. */
function curtain_highlight_resize() {
    curtain.style.height = get_page_height() + "px";
    curtain.style.width = get_page_width() + "px";
    highlight.evaluate_position_and_size();
}

/** get the height of the webpage. 
 * @returns {number} the height of the webpage
 */
function get_page_height() {
    return Math.max(document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
    );
}

/**get the width of the webpage 
 * @returns {number} the width of the webpage
 */
function get_page_width() {
    return Math.max(document.body.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.clientWidth,
        document.documentElement.scrollWidth,
        document.documentElement.offsetWidth
    );
}