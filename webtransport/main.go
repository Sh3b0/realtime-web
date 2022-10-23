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

		fmt.Println("Client connected")
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

	ctx, cancel := context.WithCancel(context.Background())
	if err := server.Run(ctx); err != nil {
		cancel()
		log.Fatal(err)
	}
}
