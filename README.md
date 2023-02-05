# realtime-web
Experimenting with WebSocket, WebRTC, and WebTransport by streaming 2500 coordinates from server to client to visualize.
> Checkout the discussion on [HackerNews](https://news.ycombinator.com/item?id=34137974)

## Demos

<details>
<summary>0% Packet loss</summary>

https://user-images.githubusercontent.com/40727318/215340433-ac2543e7-e2eb-4c4f-b3c1-d5adc4abffd3.mp4

</details>

<details>
<summary>15% Packet loss (unreliable WebRTC/WebTransport)</summary>

https://user-images.githubusercontent.com/40727318/215340455-66b51c24-9015-4086-9453-4230cf72cea6.mp4

</details>

<details>
<summary>15% Packet loss (reliable WebRTC/WebTransport)</summary>

https://user-images.githubusercontent.com/40727318/215340465-ebe2c5cf-839c-4822-9df6-eb177fe2bb77.mp4

</details>

## Experiment details

All servers are written in Go and hosted locally. All connections use HTTPS with self-signed certificates, connection establishment period is excluded from the time graph.

**In the first experiment**, WebRTC data channel and WebTransport server are operating in unreliable modes, undelivered packets are not retransmitted. However, since the network is reliable, we can see almost no performance differences between the protocols.

**In the second experiment**, WebRTC data channel and WebTransport server are still operating in unreliable modes, but any packet may be dropped with a probability of 15%. We can see WebSocket performance starting to suffer due to TCP head-of-line blocking. Results varied over multiple runs, with WebTransport constantly managing to deliver more messages than WebRTC.

**In the third experiment**, all protocols are operating in reliable modes. WebRTC uses a `maxRetransmission` value of `5` and WebTransport server uses a server-initiated unidirectional stream. Interestingly, WebTransport maintained a very stable and efficient behavior while WebRTC suffered what looks like a sender-side head-of-line blocking.

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

4. Simulating packet loss (use `del` instead of `add` to remove rules)
    ```bash
    sudo tc qdisc add dev lo root netem loss 15%
    ```
    
5. Run client
    ```bash
    ./run.sh client
    chromium --origin-to-force-quic-on=localhost:8001 http://localhost:3000
    ```

