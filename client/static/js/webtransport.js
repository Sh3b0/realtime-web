import {chart, initCanvas, visualizePacket} from "./common.js"

const webTransportBtn = document.getElementById("webtransport");
const serverUrl = "https://localhost:8001";
const mode = "reliable";

webTransportBtn.onclick = async (_) => {
    initCanvas()
    // webTransportBtn.disabled = true;
    console.info(`Connecting to WebTransport server at ${serverUrl} ...`);

    let t0 = new Date();
    let messageCount = 0;
    const client = new WebTransport(serverUrl);

    client.closed.then(() => {
        chart.data.datasets[1].data.push({x: new Date() - t0, y: messageCount});
        chart.update();
        console.info(`${messageCount} message(s) were received within ${new Date() - t0} ms.`);
    }).catch((error) => {
        console.error(`The HTTP/3 connection to ${serverUrl} closed due to ${error}.`);
    });

    await client.ready;
    console.info(`Connection established in ${new Date() - t0} ms.`);

    t0 = new Date();
    chart.data.datasets[1].data.push({x: 0, y: 0});

    let reader, decoder;
    if (mode === "unreliable") {
        reader = client.datagrams.readable.getReader();
        decoder = new TextDecoder("utf-8");
    } else {
        const streamReader = client.incomingUnidirectionalStreams.getReader()
        const {value} = await streamReader.read()
        let stream = value
        decoder = new TextDecoderStream('utf-8');
        reader = stream.pipeThrough(decoder).getReader();
    }

    let flag = false;
    while (true) {
        await reader.read().then(({value, done}) => {
            if (done) {
                console.info("Finished reading data");
                flag = true;
            }
            messageCount += 1;
            if (new Date() - t0 - chart.data.datasets[1].data.at(-1).x > 200) {
                chart.data.datasets[1].data.push({x: new Date() - t0, y: messageCount});
                chart.update();
            }
            if (mode === "unreliable") value = decoder.decode(value)
            visualizePacket(value);
        }).catch((reason) => {
            console.info(`Disconnected from WebTransport server: ${reason}`)
            flag = true;
        });
        if (flag) break;
    }
}
