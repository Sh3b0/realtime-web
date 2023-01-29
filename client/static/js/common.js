const panelContext = document.getElementById('panelCanvas').getContext('2d');
const chartContext = document.getElementById('chartCanvas').getContext('2d');

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
                borderDash: [10, 5],
            },
            {
                data: [],
                label: "WebRTC",
                borderColor: "#34A853",
                showLine: true,
                borderDash: [2, 5],
            },
        ]
    },
    options: {
        elements: {
            point:{
                radius: 0
            }
        },
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
                    text: 'Messages arrived'
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
    // console.info(packet);
    let coords = packet.split(',');
    panelContext.fillStyle = 'black';
    panelContext.fillRect(
        coords[0],
        coords[1],
        9,
        9
    )
}