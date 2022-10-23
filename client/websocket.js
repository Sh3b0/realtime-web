import {initCanvas, log, visualizePacket} from "/client/common.js";

const webSocketBtn = document.getElementById("websocket");
const serverUrl = "ws://localhost:8080";

webSocketBtn.onclick = (_) => {
    initCanvas()
    log(`Connecting to WebSocket server at ${serverUrl} ...`);

    let t0 = new Date();
    let messageCount = 0;
    const client = new WebSocket(serverUrl);

    client.onopen = (_) => {
        log(`Connection established in ${new Date() - t0} ms.`);
        t0 = new Date();
    }

    client.onmessage = (e) => {
        messageCount += 1;
        visualizePacket(e.data);
    }

    client.onclose = (_) => {
        log(`${messageCount} message(s) were received within ${new Date() - t0} ms.`)
        log('Disconnected from WebSocket server.');
    }

    client.onerror = (_) => {
        log('Failed to connect to WebSocket server');
    }
}