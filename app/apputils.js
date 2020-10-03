import document from "document";
import { readFileSync, writeFileSync, existsSync } from "fs";

import { VIEW_GUI_PATH } from "../common/config";

// ----------------------------------------------------------------------------

// Convenience functions.
export function show(element) {element.style.display = "inline"}
export function hide(element) {element.style.display = "none"}
export function isVisible(element) {
    // Note: for this method to work "display" must be specified in the XML
    return element.style.display === "inline";
}

// ----------------------------------------------------------------------------

// Base Controller for the Application.
export function AppController() {
    this._views;
    this._current;
    this.init = (views) => {
        this._views = views;
        for (let key in this._views) {
            if (this._views.hasOwnProperty(key)) {
                this._views[key].name = key;
                this._views[key].navigate = this.navigate;
            }
        }
    };
    this.navigate = (name, kwargs) => {
        if (this._current !== undefined) {this._current.onUnMount();}
        document.location.replace(`${VIEW_GUI_PATH}/${name}.view`)
            .then(() => {
                try {
                    this._current = this._views[name];
                    this._current.onMount(kwargs);
                }
                catch(err) {
                    console.log(`View Error: ${err.stack}`);
                }
            })
            .catch((error) => {
                console.log(`\n\nNavigation Error: ${error}\n`);
            });
    };
}

// ----------------------------------------------------------------------------

// Base Element Abstraction Controller.
export function AppSettings(filename) {
    this.filename = filename;
    this.save = (data) => {
        writeFileSync(this.filename, data, "cbor");
    };
    this.load = () => {
        if (existsSync(`/private/data/${this.filename}`)) {
            return readFileSync(this.filename, "cbor");
        }
        return {};
    };
    this.setValue = (key, value) => {
        let data = this.load();
        data[key] = value;
        this.save(data);
    };
    this.getValue = (key) => {
        let data = this.load();
        return data[key];
    };
}

// ----------------------------------------------------------------------------

// Base Element Abstraction Controller.
export function BaseCtlr(element) {
    this.element =  (typeof element === "string") ?
                    document.getElementById(element) : element;
    this.isVisible = () => {return isVisible(this.element);};
    this.show = () => {show(this.element);};
    this.hide = () => {hide(this.element);};
    this.getElementById = (elementId) => {
        return this.element.getElementById(elementId);
    };
    Object.defineProperty(this, "visible", {
        get: function get() {return this.isVisible();},
        set: function set(value) {(value) ? this.show() : this.hide();}
    });
}

// Text Controller.
export function TextCtrl(element) {
    BaseCtlr.call(this, element);
    Object.defineProperty(this, "text", {
        get: function get() {
            return this.element.text;
        },
        set: function set(value) {
            this.element.text = value;
        }
    });
    Object.defineProperty(this, "color", {
        get: function get() {
            return this.element.style.fill;
        },
        set: function set(value) {
            this.element.style.fill = value;
        }
    });
}
TextCtrl.prototype = Object.create(BaseCtlr.prototype);
TextCtrl.prototype.constructor = TextCtrl;


// VirtualTile List Controller.
export function VirtualTileListCtrl(element) {
    BaseCtlr.call(this, element);
    Object.defineProperty(this, "delegate", {
        get: function get() {
            return this.element.delegate;
        },
        set: function set(value) {
            this.element.delegate = value;
        }
    });
    Object.defineProperty(this, "length", {
        get: function get() {
            return this.element.length;
        },
        set: function set(value) {
            this.element.length = value;
        }
    });
}
VirtualTileListCtrl.prototype = Object.create(BaseCtlr.prototype);
VirtualTileListCtrl.prototype.constructor = VirtualTileListCtrl;


// VirtualTile List Controller.
export function ButtonTextCtrl(element) {
    BaseCtlr.call(this, element);
    Object.defineProperty(this, "onclick", {
        get: function get() {
            return this.element.onclick;
        },
        set: function set(value) {
            this.element.onclick = value;
        }
    });
}
ButtonTextCtrl.prototype = Object.create(BaseCtlr.prototype);
ButtonTextCtrl.prototype.constructor = ButtonTextCtrl;
