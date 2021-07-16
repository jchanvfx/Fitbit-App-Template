import document from "document";
import { readFileSync, writeFileSync, existsSync } from "fs";

// Convenience functions.
export function show(element) {element.style.display = "inline"}
export function hide(element) {element.style.display = "none"}
export function isVisible(element) {return element.style.display === "inline";}

// ----------------------------------------------------------------------------

// Base Application Settings Controller.
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
    this.element =  document.getElementById(element);
    this.isVisible = () => {return isVisible(this.element);}
    this.show = () => {show(this.element);}
    this.hide = () => {hide(this.element);}
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
