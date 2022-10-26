const panelContext = document.getElementById('panelCanvas').getContext('2d');
const chartContext = document.getElementById('chartCanvas').getContext('2d');

let timeStamps = linSpace(0, 10000, 15);

function linSpace(start, end, count) {
    let arr = [];
    let step = (end - start) / (count - 1);
    for (let i = 0; i < count; i++) {
        arr.push(Math.floor(start + (step * i)));
    }
    return arr;
}

export let chart = new Chart(chartContext, {
    type: 'scatter',
    data: {
        labels: [],
        datasets: [
            {
                data: [],
                label: "WebSocket",
                borderColor: "#4285F4",
                showLine: true,
            },
            {
                data: [],
                label: "WebTransport",
                borderColor: "#de5246",
                showLine: true,
            },
        ]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'time (ms)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Packets arrived'
                }
            }
        }
    }
});

export function initCanvas() {
    panelContext.fillStyle = 'white';
    for (let i = 10; i < 510; i += 10) {
        for (let j = 10; j < 510; j += 10) {
            panelContext.fillRect(
                i,
                j,
                9,
                9,
            );
        }
    }
}

export function visualizePacket(packet) {
    let messages = packet.split(' ');
    messages.forEach(message => {
        if (message === '') return;
        let coords = message.split(',');
        panelContext.fillStyle = 'black';
        panelContext.fillRect(
            coords[0],
            coords[1],
            9,
            9
        )
    });
}