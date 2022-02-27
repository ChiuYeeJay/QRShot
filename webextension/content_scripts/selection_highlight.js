class SelectionHighlight {
    constructor() {
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
        this.left_black = document.createElement("div");
        this.up_black = document.createElement("div");
        this.right_black = document.createElement("div");
        this.down_black = document.createElement("div");
        this.center = document.createElement("div");

        //> left_black
        // this.left_black = this.left_black = document.createElement("div");;
        this.left_black.style.position = "absolute";
        this.left_black.style.background = "rgba(0,0,0,0.5)";
        this.left_black.classList.add("qrshot_highlight_shadow");
        this.left_black.id = "qshot_highlight_shadow_left";

        //> up_black
        // this.up_black = document.createElement("div");
        this.up_black.style.position = "absolute";
        this.up_black.style.background = "rgba(0,0,0,0.5)";
        this.up_black.classList.add("qrshot_highlight_shadow");
        this.up_black.id = "qshot_highlight_shadow_up";

        //> right_black
        // this.right_black = document.createElement("div");
        this.right_black.style.position = "absolute";
        this.right_black.style.background = "rgba(0,0,0,0.5)";
        this.right_black.classList.add("qrshot_highlight_shadow");
        this.right_black.id = "qshot_highlight_shadow_right";

        //> down_black
        // this.down_black = document.createElement("div");
        this.down_black.style.position = "absolute";
        this.down_black.style.background = "rgba(0,0,0,0.5)";
        this.down_black.classList.add("qrshot_highlight_shadow");
        this.down_black.id = "qshot_highlight_shadow_down";

        //> center
        // this.center = document.createElement("div");
        this.center.style.position = "absolute";
        this.center.style.backgroundColor = "transparent !important";
        this.center.id = "qshot_selection_highlight";

        this.evaluate_position_and_size();
        this.hide();

        curtain.appendChild(this.left_black);
        curtain.appendChild(this.up_black);
        curtain.appendChild(this.right_black);
        curtain.appendChild(this.down_black);
        curtain.appendChild(this.center);
    }

    /** evaluate the position and size of all parts with left/top/weight/height properties.*/
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
    }

    /** show all parts */
    show() {
        this.left_black.hidden = false;
        this.up_black.hidden = false;
        this.right_black.hidden = false;
        this.down_black.hidden = false;
        this.center.hidden = false;
    }

    /** hide all parts */
    hide() {
        this.left_black.hidden = true;
        this.up_black.hidden = true;
        this.right_black.hidden = true;
        this.down_black.hidden = true;
        this.center.hidden = true;
    }

    /** setter of color.
     * @param {string} val
     */
    set color(val) {
        this.center.style.backgroundColor = val;
    }
}