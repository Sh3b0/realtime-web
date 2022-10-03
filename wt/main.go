package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/adriancable/webtransport-go"
)

//func handleWebTransportStreams(session *webtransport.Session) {
//	// Handle incoming datagrams
//	go func() {
//		for {
//			msg, err := session.ReceiveMessage(session.Context())
//			if err != nil {
//				fmt.Println("Session closed, ending datagram listener:", err)
//				break
//			}
//			fmt.Printf("Received datagram: %s\n", msg)
//
//			sendMsg := bytes.ToUpper(msg)
//			fmt.Printf("Sending datagram: %s\n", sendMsg)
//			session.SendMessage(sendMsg)
//		}
//	}()
//
//	// Handle incoming unidirectional streams
//	go func() {
//		for {
//			s, err := session.AcceptUniStream(session.Context())
//			if err != nil {
//				fmt.Println("Session closed, not accepting more uni streams:", err)
//				break
//			}
//			fmt.Println("Accepting incoming uni stream:", s.StreamID())
//
//			go func(s webtransport.ReceiveStream) {
//				for {
//					buf := make([]byte, 1024)
//					n, err := s.Read(buf)
//					if err != nil {
//						log.Printf("Error reading from uni stream %v: %v\n", s.StreamID(), err)
//						break
//					}
//					fmt.Printf("Received from uni stream: %s\n", buf[:n])
//				}
//			}(s)
//		}
//	}()
//
//	// Handle incoming bidirectional streams
//	go func() {
//		for {
//			s, err := session.AcceptStream()
//			if err != nil {
//				fmt.Println("Session closed, not accepting more bidi streams:", err)
//				break
//			}
//			fmt.Println("Accepting incoming bidi stream:", s.StreamID())
//
//			go func(s webtransport.Stream) {
//				defer s.Close()
//				for {
//					buf := make([]byte, 1024)
//					n, err := s.Read(buf)
//					if err != nil {
//						log.Printf("Error reading from bidi stream %v: %v\n", s.StreamID(), err)
//						break
//					}
//					fmt.Printf("Received from bidi stream %v: %s\n", s.StreamID(), buf[:n])
//					sendMsg := bytes.ToUpper(buf[:n])
//					fmt.Printf("Sending to bidi stream %v: %s\n", s.StreamID(), sendMsg)
//					s.Write(sendMsg)
//					// session.CloseSession()
//					// session.CloseWithError(1234, "error")
//				}
//			}(s)
//		}
//	}()
//}

func main() {
	server := &webtransport.Server{
		ListenAddr:     ":443",
		TLSCert:        webtransport.CertFile{Path: "certs/localhost.pem"},
		TLSKey:         webtransport.CertFile{Path: "certs/localhost-key.pem"},
		AllowedOrigins: []string{"localhost:63342"},
		QuicConfig: &webtransport.QuicConfig{
			KeepAlive:      true,
			MaxIdleTimeout: 30 * time.Second,
		},
	}

	http.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		session := r.Body.(*webtransport.Session)
		session.AcceptSession()

		fmt.Println("Accepted incoming WebTransport session")
		//handleWebTransportStreams(session)
		for i := 10; i < 510; i += 10 {
			for j := 10; j < 510; j += 10 {
				err := session.SendMessage([]byte(strconv.Itoa(j) + "," + strconv.Itoa(i) + " "))
				if err != nil {
					log.Println(err)
					return
				}
				time.Sleep(1 * time.Millisecond)
			}
		}
		if err := session.Close(); err != nil {
			log.Println(err)
			return
		}
	})

	fmt.Println("Launching WebTransport server at", server.ListenAddr)
	ctx, cancel := context.WithCancel(context.Background())
	if err := server.Run(ctx); err != nil {
		cancel()
		log.Fatal(err)
	}
}
