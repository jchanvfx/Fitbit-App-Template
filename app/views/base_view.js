import clock from "clock";
import document from "document";

import { display } from "display";
import { inbox } from "file-transfer"
import { me } from "appbit";

import { format12hrTime } from "../../common/datetime";
import { debugLog } from "../../common/utils";

import * as messaging from "messaging";
import * as apputils from "../apputils";
import * as cfg from "../../common/config";

let NoPhone;
let ButtonTest;
let ButtonClose;
let Settings;

// screen entry point.
let VIEWS;
let OPTIONS;
export function init(_views, _options) {
    VIEWS   = _views;
    OPTIONS = _options;

    Settings = new apputils.AppSettings(cfg.APP_SETTINGS_FILE);

    NoPhone = new apputils.BaseCtlr("no-phone");
    ButtonTest = document.getElementById("btn-test");
    ButtonClose = document.getElementById("btn-close");

    // mount the screen.
    onMount();
    debugLog(">>> :: initialize! - base_view");
    return onUnMount;
}

function onMount() {

    NoPhone.hide();

    // log time
    clock.granularity               = "minutes";
    clock.ontick                    = (evt) => {
        let time = format12hrTime(evt.date);
        debugLog(`${time.hours}:${time.mins}${time.ampm}`);
    }
    // messaging
    messaging.peerSocket.onmessage  = onMessageRecieved;
    messaging.peerSocket.onopen     = () => {debugLog("App Socket Open");}
    messaging.peerSocket.onclose    = () => {debugLog("App Socket Closed");}
    // data inbox
    inbox.onnewfile                 = onDataRecieved;

    // wire up buttons
    ButtonTest.onactivate           = () => {debugLog("Test Pressed");};
    ButtonClose.onactivate          = () => {debugLog("Close Pressed");};

    document.addEventListener("keypress", onKeyPressEvent);
    debugLog(">>> mounted - base_view");
}

// Clean-up function executed before the view is unloaded.
// No need to unsubscribe from DOM events, it's done automatically.
function onUnMount() {
    clock.granularity               = "off";
    clock.ontick                    = undefined;
    inbox.onnewfile                 = undefined;
    messaging.peerSocket.onopen     = undefined;
    messaging.peerSocket.onclose    = undefined;
    messaging.peerSocket.onmessage  = undefined;
    debugLog(">>> unMounted - base_view");
}

// ----------------------------------------------------------------------------

// send data to the companion via Messaging API
function sendValue(key, value=null) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.CLOSED) {
        debugLog("Phone Connection Lost!");
        return;
    }
    let data = (value === null) ? {key: key} : {key: key, value: value};
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
