const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

export function initCanvas() {
    context.fillStyle = 'white';
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

export function log(text) {
    let console = document.getElementById('console');
    let latestEntry = console.lastElementChild;
    let logLine = document.createElement('li');
    logLine.innerText = text;
    console.appendChild(logLine);

    if (latestEntry != null && latestEntry.getBoundingClientRect().top < console.getBoundingClientRect().bottom) {
        logLine.scrollIntoView();
    }
}

export function visualizePacket(packet) {
    let messages = packet.split(' ');
    messages.forEach(message => {
        if (message === '') return;
        let coords = message.split(',');
        context.fillStyle = 'black';
        context.fillRect(
            coords[0],
            coords[1],
            9,
            9
        )
    });
}