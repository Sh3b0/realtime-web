# realtime-web

Benchmarking WebSocket, WebRTC, and WebTransport with a simple real-time web application.

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

4. Simulating delay and packet loss
    ```bash
    sudo tc qdisc add dev lo root netem delay 200ms
    sudo tc qdisc add dev lo root netem loss 25%
    ```

5. Run client
    ```bash
    ./run.sh client
    chromium --origin-to-force-quic-on=localhost:8001 ./client/index.html
    ```

## Port Mapping
- Client       : Port 3000
- WebSocket    : Port 8000
- WebTransport : Port 8001
