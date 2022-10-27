# realtime-web

Experimenting with WebSocket, WebRTC, and WebTransport by streaming 2500 coordinates from server to client to visualize.

## Demos

### 0% Packet loss

![1](./gifs/1.gif)

### 15% Packet loss

![2](./gifs/2.gif)

### 3. 200ms delay + 20% packet loss

![3](./gifs/3.gif)

## Experiment details

All servers are written in Go and hosted locally. All connections use HTTPS with self-signed certificates, connection establishment period is excluded from the time graph.

**In the first experiment**, WebRTC data channel and WebTransport server are operating in unreliable modes, undelivered packets will not be retransmitted. However, since the network is reliable, we can see almost no performance differences between the protocols.

**In the second experiment**, WebRTC data channel and WebTransport server are still operating in unreliable modes and a packet may be dropped with a probability of 15%. We can see WebSocket performance suffering due to TCP head-of-line blocking. WebRTC connection had a slow start since it relies on WebSocket for signaling. Yet WebTransport maintained a stable and efficient behavior.

**In the second experiment**, WebRTC data channel is set up for ordered delivery and a `maxRetransmission` value of `5` to ensure reliability. WebTransport server uses a server-initiated unidirectional stream which is better suited for this experiment where data flows in one direction.

**Additional notes:**

- UDP Receive buffer size was incremented as suggested in https://github.com/lucas-clemente/quic-go/wiki/UDP-Receive-Buffer-Size

- No limits were specified on packet size or how protocols buffer packets.
- Libraries used: [gorilla/websocket](https://github.com/gorilla/websocket), [pion/webrtc](https://github.com/pion/webrtc), and [adriancable/webtransport-go](https://github.com/adriancable/webtransport-go)
- Client is written in pure HTML/CSS/JS. Static files were served by JetBrains debugging server, an additional Go server for static files is included. [Bootstrap](https://getbootstrap.com/) and [Chart.js](https://www.chartjs.org/) were used.

## Local testing

1. Clone repo
    ```bash
    git clone https://github.com/Sh3B0/realtime-web.git
    cd realtime-web
    ```

2. Create locally trusted certs using [mkcert](https://github.com/FiloSottile/mkcert) 
    ```bash
    mkdir certs && cd certs
    mkcert -install
    mkcert localhost
    ```

3. Run a server (use similar commands for `webtransport` and `webrtc`)
    ```bash
    ./run.sh websocket
    ```

4. Simulating delay and packet loss (use `del` instead of `add` to remove rules)
    ```bash
    sudo tc qdisc add dev lo root netem delay 200ms loss 20%
    ```
    
5. Run client
    ```bash
    ./run.sh client
    chromium --origin-to-force-quic-on=localhost:8001 http://localhost:3000
    ```

