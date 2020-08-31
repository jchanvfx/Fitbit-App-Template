import { encode } from "cbor";
import { outbox } from "file-transfer";
import { me as companion } from "companion";
import { settingsStorage } from "settings";

import * as messaging from "messaging";


// check permissions
if (!companion.permissions.granted("access_internet")) {
    console.log("We're not allowed to access the internet!");
}

// send data to device via Messaging API
function sendValue(key, value=null) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.CLOSED) {
        debugLog("Device Connection Lost!");
        return;
    }
    let data = (value === null) ? {key: key} : {key: key, value: value};
    messaging.peerSocket.send(data);
}

// send data to device via FileTransfer API
function sendData(key, data, filename, message=null) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        // queue data.
        outbox.enqueue(filename, encode(data))
        .then(function(ft) {
            if (message === null) {
                messaging.peerSocket.send({key: key});
            } else {
                messaging.peerSocket.send({key: key, value: message});
            }
            console.log(`Transfer of "${filename}" successfully queued.`);
        })
        .catch(function(err) {
            throw new Error(`Failed to queue ${filename}  Error: ${err}`);
        });
    }
}

// ----------------------------------------------------------------------------

// settings changed callback
settingsStorage.onchange = (evt) => {
    let settingsKey = evt.key;
    switch (settingsKey) {
        case "testKey":
            let selectedItem    = JSON.parse(evt.newValue).values[0];
            let name            = selectedClub.name;
            let value           = selectedClub.value;
            sendValue("settingsChanged", value);
            break;
        default:
            return;
    }
}

// message is received
messaging.peerSocket.onmessage = (evt) => {
    let requestKey = evt.data.key;
    let currentSetting = settingsStorage.getItem("testKey");
    switch (requestKey) {
        case "foo":
            if (currentSetting != null) {
                let selectedItem    = JSON.parse(currentSetting).values[0];
                let name            = selectedItem.name;
                let value           = selectedItem.value;
                sendValue("foo-reply", value);
            } else {
                sendValue("foo-settingsNotSet");
            }
            break;
        default:
            return;
    }
}
// message socket opens
messaging.peerSocket.onopen = () => {
    console.log("Companion Socket Open");
};
// message socket closes
messaging.peerSocket.onclose = () => {
    console.log("Companion Socket Closed");
}
// listen for the onerror event
messaging.peerSocket.onerror = (err) => {
    console.log(`Connection error: ${err.code} - ${err.message}`);
}
