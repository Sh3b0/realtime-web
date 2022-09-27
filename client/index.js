const webSocketBtn = document.getElementById("websocket");
// const directSocketBtn = document.getElementById("dsocket");
// const webRTCBtn = document.getElementById("webrtc");
const webTransportBtn = document.getElementById("webtransport");

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

webSocketBtn.onclick = (_) => {
    const url = "ws://localhost:8080";
    initCanvas()
    consoleAppend(`Connecting to WebSocket server at ${url} ...`);

    let startTime = new Date(), messageCount = 0;
    const client = new WebSocket(url);

    client.onopen = (_) => {
        consoleAppend(`Connection established in ${new Date() - startTime} ms.`);
        startTime = new Date();
    }

    client.onmessage = (e) => {
        messageCount += 1;
        let indices = e.data.split(',')
        context.fillStyle = 'green';
        context.fillRect(
            indices[0],
            indices[1],
            9,
            9
        )
    }

    client.onclose = (_) => {
        consoleAppend(`${messageCount} packet(s) were received within ${new Date() - startTime} ms.`)
        consoleAppend('Disconnected from WebSocket server.');
    }

    client.onerror = (_) => {
        consoleAppend('Failed to connect to WebSocket server');
    }
}

webTransportBtn.onclick = async (_) => {
    const url = "https://localhost:443";
    // let messageCount = 0;

    initCanvas()
    consoleAppend(`Connecting to WebTransport server at ${url} ...`);

    let startTime = new Date();
    const client = new WebTransport(url);

    client.closed.then(() => {
        consoleAppend(`The HTTP/3 connection to ${url} closed gracefully.`);
    }).catch((error) => {
        consoleAppend(`The HTTP/3 connection to ${url} closed due to ${error}.`);
    });

    await client.ready;
    consoleAppend(`Connection established in ${new Date() - startTime} ms.`);

    const reader = client.stream.readable.getReader();
    while (true) {
        const {value, done} = await reader.read();
        if (done) {
            break;
        }
        consoleAppend(value);
    }
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

function consoleAppend(text) {
    let console = document.getElementById('console');
    let latestEntry = console.lastElementChild;
    let logLine = document.createElement('li');
    logLine.innerText = text;
    console.appendChild(logLine);

    if (latestEntry != null && latestEntry.getBoundingClientRect().top < console.getBoundingClientRect().bottom) {
        logLine.scrollIntoView();
    }
}
