const webSocketBtn = document.getElementById("websocket");
// const directSocketBtn = document.getElementById("dsocket");
// const webRTCBtn = document.getElementById("webrtc");
const webTransportBtn = document.getElementById("webtransport");

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

webSocketBtn.onclick = (_) => {
    const url = "ws://localhost:8080";
    initCanvas()
    console.log(`Connecting to WebSocket server at ${url} ...`);

    let startTime = new Date(), messageCount = 0;
    const client = new WebSocket(url);

    client.onopen = (_) => {
        console.log(`Connection established in ${new Date() - startTime} ms.`);
        startTime = new Date();
    }

    client.onmessage = (e) => {
        messageCount += 1;
        visualizePacket(e.data);
    }

    client.onclose = (_) => {
        console.log(`${messageCount} packet(s) were received within ${new Date() - startTime} ms.`)
        console.log('Disconnected from WebSocket server.');
    }

    client.onerror = (_) => {
        console.log('Failed to connect to WebSocket server');
    }
}

webTransportBtn.onclick = async (_) => {
    const url = "https://localhost:443";

    initCanvas()
    console.log(`Connecting to WebTransport server at ${url} ...`);

    let startTime = new Date();
    const client = new WebTransport(url);

    client.closed.then(() => {
        console.log(`The HTTP/3 connection to ${url} closed gracefully.`);
    }).catch((error) => {
        console.log(`The HTTP/3 connection to ${url} closed due to ${error}.`);
    });

    await client.ready;
    console.log(`Connection established in ${new Date() - startTime} ms.`);
    startTime = new Date();
    const reader = client.datagrams.readable.getReader();
    // const reader = client.incomingUnidirectionalStreams.getReader();
    let decoder = new TextDecoder('utf-8');
    while (true) {
        const {value, done} = await reader.read();
        if (done) {
            console.log('Finished reading streams.');
            break;
        }
        visualizePacket(decoder.decode(value));
        // console.log(decoder.decode(value));
        // let messageCount = await readFromIncomingStream(value, 1);
        // console.log(`${messageCount} packet(s) were received within ${new Date() - startTime} ms.`)
    }
}


async function readFromIncomingStream(stream, number) {
    let decoder = new TextDecoderStream('utf-8');
    let reader = stream.pipeThrough(decoder).getReader();
    let messageCount = 0;
    try {
        while (true) {
            const {value, done} = await reader.read();
            if (done) {
                console.log('Stream #' + number + ' closed');
                return;
            }
            messageCount++;
            visualizePacket(value);
        }
    } catch (e) {
        console.log('Error while reading from stream #' + number + ': ' + e);
    }
    return messageCount;
}

function initCanvas() {
    context.fillStyle = 'red';
    for (let i = 10; i < 510; i += 10) {
        for (let j = 10; j < 510; j += 10) {
            context.fillRect(
                i,
                j,
                9,
                9,
            );
        }
    }
}

// function log(text) {
//     let console = document.getElementById('console');
//     let latestEntry = console.lastElementChild;
//     let console.logLine = document.createElement('li');
//     console.logLine.innerText = text;
//     console.appendChild(console.logLine);
//
//     if (latestEntry != null && latestEntry.getBoundingClientRect().top < console.getBoundingClientRect().bottom) {
//         console.logLine.scrollIntoView();
//     }
// }

function visualizePacket(packet) {
    let messages = packet.split(' ');
    messages.forEach(message => {
        if (message === '') return;
        console.log(message)
        let coords = message.split(',');
        context.fillStyle = 'green';
        context.fillRect(
            coords[0],
            coords[1],
            9,
            9
        )
    });
}