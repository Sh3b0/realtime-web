# realtime-web

Experimenting with WebSocket, WebRTC, and WebTransport by streaming 2500 coordinates from server to client to visualize.

## Demo

[![Demo](https://img.youtube.com/vi/8PWr6jvGsmQ/0.jpg)](https://www.youtube.com/watch?v=8PWr6jvGsmQ/0.jpg)

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

3. Run a server (use similar commands for webtransport and webrtc)
    ```bash
    ./run.sh websocket
    ```

4. Simulating delay and packet loss (use `del` instead of `add` to remove rules)
    ```bash
    sudo tc qdisc add dev lo root netem delay 100ms loss 15%
    ```
    
5. Run client
    ```bash
    ./run.sh client
    chromium --origin-to-force-quic-on=localhost:8001 http://localhost:3000
    ```

