import clock from "clock";
import document from "document";

import { display } from "display";
import { inbox } from "file-transfer"
import { me } from "appbit";

import { format12hrTime } from "../../common/datetime";
import { debugLog } from "../../common/utils";

import * as messaging from "messaging";
import * as app from "../apputils";
import * as cfg from "../../common/config";


let NoPhone;
let Button;
let Settings;


export function ExampleViewController() {
    this.name;
    this.navigate;
    this.onMount = (kwargs) => {

        Settings = new app.AppSettings(cfg.APP_SETTINGS_FILE);
        Button = new app.ButtonTextCtrl("mybtn");
        NoPhone  = new app.BaseCtlr("no-phone");

        NoPhone.hide();

        Button.onclick = () => {
            debugLog("fooo");
            this.navigate("list_example");
        };

        // log time
        clock.granularity               = "minutes";
        clock.ontick                    = (evt) => {
            let time = format12hrTime(evt.date);
            // debugLog(`${time.hours}:${time.mins}${time.ampm}`);
        };
        // messaging
        messaging.peerSocket.onmessage  = onMessageRecieved;
        messaging.peerSocket.onopen     = () => {debugLog("App Socket Open");};
        messaging.peerSocket.onclose    = () => {debugLog("App Socket Closed");};
        // data inbox
        inbox.onnewfile                 = onDataRecieved;

        document.onkeypress = onKeyPressEvent;

        debugLog(`>>> :: initialize view! - ${this.name}`);
    };
    this.onUnMount = () => {
        clock.granularity               = "off";
        clock.ontick                    = undefined;
        inbox.onnewfile                 = undefined;
        messaging.peerSocket.onopen     = undefined;
        messaging.peerSocket.onclose    = undefined;
        messaging.peerSocket.onmessage  = undefined;

        debugLog(`>>> :: unmounted view! - ${this.name}`);
    };

}

// ----------------------------------------------------------------------------

// send data to the companion via Messaging API
function sendValue(key, value=undefined) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.CLOSED) {
        debugLog("Phone Connection Lost!");
        return;
    }
    let data = (value === undefined) ? {key: key} : {key: key, value: value};
    messaging.peerSocket.send(data);
    debugLog("Data request sent");
}

// callback when a message is recieved.
function onMessageRecieved(evt) {
    display.poke();
    let requestKey = evt.data.key;
    switch (requestKey) {
        case "settingsChanged":
            let requestValue = evt.data.value;
            debugLog(`message value recieved: ${requestValue}`);
            break;
        default:
            return;
    }
}

// callback when file transfer is recieved.
function onDataRecieved() {
    let fileName;
    while (fileName = inbox.nextFile()) {
        debugLog(`File ${fileName} recieved!`);
    }
}

// callback when physical button is pressed.
function onKeyPressEvent(evt) {
    if (evt.key === "back") {
        evt.preventDefault();
        // VIEWS.navigate("");
        me.exit();
    }
}
