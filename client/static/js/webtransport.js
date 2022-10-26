import {initCanvas, log, visualizePacket} from "./common.js"

const webTransportBtn = document.getElementById("webtransport");
const serverUrl = "https://localhost:8001";

webTransportBtn.onclick = async (_) => {
    initCanvas()
    log(`Connecting to WebTransport server at ${serverUrl} ...`);

    let t0 = new Date();
    let messageCount = 0;
    const client = new WebTransport(serverUrl);

    client.closed.then(() => {
        log(`${messageCount} message(s) were received within ${new Date() - t0} ms.`);
    }).catch((error) => {
        log(`The HTTP/3 connection to ${serverUrl} closed due to ${error}.`);
    });

    await client.ready;
    log(`Connection established in ${new Date() - t0} ms.`);

    t0 = new Date();
    const reader = client.datagrams.readable.getReader();
    const decoder = new TextDecoder('utf-8');
    let flag = false;
    while(true) {
        await reader.read().then(({value, done}) => {
            if (done) {
                log("Finished reading data");
                flag = true;
            }
            messageCount += 1;
            visualizePacket(decoder.decode(value));
        }).catch((_) => {
            log("Disconnected from WebTransport server")
            flag = true;
        });
        if(flag) break;
    }
}
