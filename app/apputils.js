import { readFileSync, writeFileSync, existsSync } from "fs";

// create application settings object for serializing data.
export function createAppSettings(filename) {
    return {
        filename = filename,
        save() {
            writeFileSync(this.filename, data, "cbor");
        },
        load() {
            if (existsSync(`/private/data/${settingsFile}`)) {
                return readFileSync(settingsFile, "cbor");
            }
            return {};
        },
        setValue(key, value) {
            let data = this.load();
            data[key] = value;
            this.save(data);
        },
        getValue(key) {
            let data = this.load();
            return data[key];
        }
    };
}
// element visibility convenience functions.
export function show(element) {element.style.display = "inline"}
export function hide(element) {element.style.display = "none"}
export function isVisible(element) {return element.style.display === "inline";}