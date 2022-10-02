package main

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/lucas-clemente/quic-go/http3"
	"github.com/marten-seemann/webtransport-go"
)

func main() {
	server := webtransport.Server{
		H3:          http3.Server{Addr: ":443"},
		CheckOrigin: func(r *http.Request) bool { return true },
	}

	http.HandleFunc("/", func(writer http.ResponseWriter, reader *http.Request) {
		conn, err := server.Upgrade(writer, reader)
		if err != nil {
			log.Printf("Upgrading failed: %s", err)
			writer.WriteHeader(500)
			return
		}
		stream, err := conn.OpenUniStream()
		for i := 10; i < 510; i += 10 {
			for j := 10; j < 510; j += 10 {
				_, err := stream.Write([]byte(strconv.Itoa(j) + "," + strconv.Itoa(i) + " "))
				if err != nil {
					log.Println(err)
					return
				}
				time.Sleep(1 * time.Millisecond)
			}
		}
		if err := conn.Close(); err != nil {
			log.Println(err)
			return
		}
	})

	log.Fatal(server.ListenAndServeTLS("certs/localhost.pem", "certs/localhost-key.pem"))
}
