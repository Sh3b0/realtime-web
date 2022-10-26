package main

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
	"github.com/pion/webrtc/v3"
)

func encode(obj interface{}) string {
	b, err := json.Marshal(obj)
	if err != nil {
		log.Fatal(err)
	}
	return base64.StdEncoding.EncodeToString(b)
}

func decode(in string, obj interface{}) {
	b, err := base64.StdEncoding.DecodeString(in)
	if err != nil {
		log.Fatal(err)
	}
	err = json.Unmarshal(b, obj)
	if err != nil {
		log.Fatal(err)
	}
}

func runSignalingServer(pc *webrtc.PeerConnection) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		var upgrader = websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		}

		wsConn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Fatal(err)
		}

		log.Println("Client Connected")

		//var message []byte = nil
		for {
			_, message, err := wsConn.ReadMessage()
			if err != nil {
				log.Fatal(err)
			}
			//if message != nil {
			//	break
			//}

			offer := webrtc.SessionDescription{}
			decode(string(message[:]), &offer)

			if err := pc.SetRemoteDescription(offer); err != nil {
				log.Fatal(err)
			}

			//log.Printf("Server Remote SDP: %s\n", offer)

			answer, err := pc.CreateAnswer(nil)
			if err != nil {
				log.Fatal(err)
			}
			if err := pc.SetLocalDescription(answer); err != nil {
				log.Fatal(err)
			}

			gatherComplete := webrtc.GatheringCompletePromise(pc)
			<-gatherComplete

			//log.Printf("Server Local SDP: %s\n", *pc.LocalDescription())

			if err := wsConn.WriteMessage(websocket.TextMessage, []byte(encode(*pc.LocalDescription()))); err != nil {
				log.Fatal(err)
			}

			//if err := wsConn.Close(); err != nil {
			//	log.Fatal(err)
			//}
		}
	})

	log.Println("Signaling server is listening at :8002")
	log.Fatal(http.ListenAndServeTLS(":8002",
		"../certs/localhost.pem", "../certs/localhost-key.pem", nil))
}

func main() {
	conn, err := webrtc.NewPeerConnection(webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{"stun:stun.l.google.com:19302"},
			},
		},
	})
	if err != nil {
		log.Fatal(err)
	}

	go runSignalingServer(conn)

	conn.OnConnectionStateChange(func(s webrtc.PeerConnectionState) {
		log.Printf("Connection State: %s\n", s.String())

		if s == webrtc.PeerConnectionStateFailed {
			log.Fatal("Peer Connection failed")
		}
	})

	conn.OnDataChannel(func(channel *webrtc.DataChannel) {
		channel.OnOpen(func() {
			log.Println("Channel Open")
			for i := 10; i < 510; i += 10 {
				for j := 10; j < 510; j += 10 {
					if err := channel.Send([]byte(strconv.Itoa(j) + "," + strconv.Itoa(i) + " ")); err != nil {
						log.Fatal(err)
					}
					time.Sleep(1 * time.Millisecond)
				}
			}
			//if err := conn.Close(); err != nil {
			//	log.Fatal(err)
			//}
			//log.Println("Transfer complete. Shutting down...")
			//os.Exit(0)
		})
	})

	// Block forever
	select {}
}
