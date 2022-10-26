package main

//
//import (
//	"fmt"
//	"log"
//	"os"
//	"strconv"
//	"time"
//
//	"github.com/pion/webrtc/v3"
//)
//
//func main() {
//	config := webrtc.Configuration{
//		ICEServers: []webrtc.ICEServer{
//			{
//				URLs: []string{"stun:stun.l.google.com:19302"},
//			},
//		},
//	}
//
//	conn, err := webrtc.NewPeerConnection(config)
//	if err != nil {
//		log.Println(err)
//	}
//
//	defer func() {
//		if err := conn.Close(); err != nil {
//			log.Println(err)
//		}
//	}()
//
//	conn.OnConnectionStateChange(func(s webrtc.PeerConnectionState) {
//		fmt.Printf("Peer Connection State has changed: %s\n", s.String())
//
//		if s == webrtc.PeerConnectionStateFailed {
//			log.Println("Peer Connection failed")
//			os.Exit(0)
//		}
//	})
//
//	conn.OnDataChannel(func(channel *webrtc.DataChannel) {
//		channel.OnOpen(func() {
//			log.Println("Channel Open")
//
//			for i := 10; i < 510; i += 10 {
//				for j := 10; j < 510; j += 10 {
//					if err := channel.Send([]byte(strconv.Itoa(j) + "," + strconv.Itoa(i) + " ")); err != nil {
//						log.Println(err)
//						return
//					}
//					time.Sleep(1 * time.Millisecond)
//				}
//			}
//		})
//	})
//
//	//offer := webrtc.SessionDescription{}
//	//signal.Decode(signal.MustReadStdin(), &offer)
//
//	if err := conn.SetRemoteDescription(offer); err != nil {
//		log.Println(err)
//	}
//
//	answer, err := conn.CreateAnswer(nil)
//	if err != nil {
//		log.Println(err)
//	}
//
//	// Create channel that is blocked until ICE Gathering is complete
//	gatherComplete := webrtc.GatheringCompletePromise(conn)
//
//	if err := conn.SetLocalDescription(answer); err != nil {
//		panic(err)
//	}
//
//	<-gatherComplete
//
//	// Output the answer in base64 so we can paste it in browser
//	fmt.Println(signal.Encode(*conn.LocalDescription()))
//
//	// Block forever
//	select {}
//}
