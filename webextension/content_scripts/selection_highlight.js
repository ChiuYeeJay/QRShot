var highlight = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    left_black: this.left_black = document.createElement("div"),
    up_black: this.left_black = document.createElement("div"),
    right_black: this.left_black = document.createElement("div"),
    down_black: this.left_black = document.createElement("div"),
    center: this.left_black = document.createElement("div"),

    constructor() {
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;

        // this.left_black = this.left_black = document.createElement("div");;
        this.left_black.style.position = "absolute";
        this.left_black.style.background = "rgba(0,0,0,0.5)";
        this.left_black.classList.add("qrshot_highlight_shadow");
        this.left_black.id = "qshot_highlight_shadow_left";

        // this.up_black = document.createElement("div");
        this.up_black.style.position = "absolute";
        this.up_black.style.background = "rgba(0,0,0,0.5)";
        this.up_black.classList.add("qrshot_highlight_shadow");
        this.up_black.id = "qshot_highlight_shadow_up";

        // this.right_black = document.createElement("div");
        this.right_black.style.position = "absolute";
        this.right_black.style.background = "rgba(0,0,0,0.5)";
        this.right_black.classList.add("qrshot_highlight_shadow");
        this.right_black.id = "qshot_highlight_shadow_right";

        // this.down_black = document.createElement("div");
        this.down_black.style.position = "absolute";
        this.down_black.style.background = "rgba(0,0,0,0.5)";
        this.down_black.classList.add("qrshot_highlight_shadow");
        this.down_black.id = "qshot_highlight_shadow_down";

        // this.center = document.createElement("div");
        this.center.style.position = "absolute";
        this.center.style.backgroundColor = "transparent !important";
        this.center.id = "qshot_selection_highlight";

        this.evaluate_position_and_size();
        this.hide();

        root.appendChild(this.left_black);
        root.appendChild(this.up_black);
        root.appendChild(this.right_black);
        root.appendChild(this.down_black);
        root.appendChild(this.center);
    },

    evaluate_position_and_size() {
        let page_w = get_page_width();
        let page_h = get_page_height();
        this.left_black.style.left = "0px";
        this.left_black.style.top = this.top + "px";
        this.left_black.style.width = this.left + "px";
        this.left_black.style.height = this.height + "px";

        this.up_black.style.left = "0px";
        this.up_black.style.top = "0px";
        this.up_black.style.width = page_w + "px";
        this.up_black.style.height = this.top + "px";

        this.right_black.style.left = this.left + this.width + "px";
        this.right_black.style.top = this.top + "px";
        this.right_black.style.width = page_w - (this.left + this.width) + "px";
        this.right_black.style.height = this.height + "px";

        this.down_black.style.left = "0px";
        this.down_black.style.top = this.top + this.height + "px";
        this.down_black.style.width = page_w + "px";
        this.down_black.style.height = page_h - (this.top + this.height) + "px";

        this.center.style.left = this.left + "px";
        this.center.style.top = this.top + "px";
        this.center.style.width = this.width + "px";
        this.center.style.height = this.height + "px";

    },

    show() {
        this.left_black.hidden = false;
        this.up_black.hidden = false;
        this.right_black.hidden = false;
        this.down_black.hidden = false;
        this.center.hidden = false;
    },

    hide() {
        this.left_black.hidden = true;
        this.up_black.hidden = true;
        this.right_black.hidden = true;
        this.down_black.hidden = true;
        this.center.hidden = true;
    },

    set color(val) {
        this.center.style.backgroundColor = val;
    }
}