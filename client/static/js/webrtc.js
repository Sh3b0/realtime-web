// import {log, initCanvas, visualizePacket} from "./common.js";
//
// const webRTCBtn = document.getElementById("webrtc");
// let serverSDP;
//
// webRTCBtn.onclick = (_) => {
//     initCanvas();
//
//     // Get server SDP from signaling (websocket) server
//     const client = new WebSocket("ws://localhost:8080");
//     client.onmessage = (e) => serverSDP = e.data;
//
//     let conn = new RTCPeerConnection({iceServers: [{urls: 'stun:stun.l.google.com:19302'}]});
//     let receiveChannel = conn.createDataChannel('channel');
//
//     receiveChannel.onopen = () => log('Connection opened');
//     receiveChannel.onclose = () => log('Connection closed');
//     receiveChannel.onmessage = (e) => {
//         console.log(e.data);
//         visualizePacket(e.data);
//     }
//
//     conn.oniceconnectionstatechange = _ => log(conn.iceConnectionState)
//     conn.onicecandidate = event => {
//         if (event.candidate === null) {
//             log(btoa(JSON.stringify(conn.localDescription)));
//         }
//     }
//
//     try {
//         conn.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(serverSDP)))).then(r => log(r))
//     } catch (e) {
//         log(e)
//     }
// }
