# realtime-web

Experimenting with WebSocket, WebRTC, and WebTransport by streaming 2500 coordinates from server to client to visualize.

## Demos

### 0% Packet loss

![1](./gifs/1.gif)

### 15% Packet loss, Unreliable WebRTC and WebTransport

![2](./gifs/2.gif)

### 15% Packet loss, Reliable WebRTC and WebTransport

![3](./gifs/3.gif)

## Experiment details

All servers are written in Go and hosted locally. All connections use HTTPS with self-signed certificates, connection establishment period is excluded from the time graph.

**In the first experiment**, WebRTC data channel and WebTransport server are operating in unreliable modes, undelivered packets will not be retransmitted. However, since the network is reliable, we can see almost no performance differences between the protocols.

**In the second experiment**, WebRTC data channel and WebTransport server are still operating in unreliable modes and a packet may be dropped with a probability of 15%. We can see WebSocket performance suffering due to TCP head-of-line blocking. WebRTC connection establishment took longer than usual since it relies on WebSocket for signaling. Yet WebTransport maintained a stable and efficient behavior.

**The third experiment is the same as the second one** except now, WebRTC data channel is set up for ordered delivery and a `maxRetransmission` value of `5` to ensure reliability. WebTransport server used a server-initiated, reliable, and unidirectional stream which is better suited for this experiment (since data flows only in one direction). We can see WebRTC packets often arrive in bulk since ordered delivery enforces a large buffer (newer packets were buffered waiting for older ones to be retransmitted). This results in an overall behavior not better than WebSocket. In the end, WebTransport was the fastest protocol to deliver all the coordinates with the smallest number of packets transmitted.

**Additional notes:**

- UDP Receive buffer size was incremented as suggested in https://github.com/lucas-clemente/quic-go/wiki/UDP-Receive-Buffer-Size

- No limits were specified on packet size or how protocols buffer packets.
- Libraries used: [gorilla/websocket](https://github.com/gorilla/websocket), [pion/webrtc](https://github.com/pion/webrtc), and [adriancable/webtransport-go](https://github.com/adriancable/webtransport-go)
- Client is written in pure HTML/CSS/JS. Static files were served by JetBrains debugging server, an additional Go server for static files is included in this repo. [Bootstrap](https://getbootstrap.com/) and [Chart.js](https://www.chartjs.org/) were used.

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

