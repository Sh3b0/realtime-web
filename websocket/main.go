package main

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
)

func serve(w http.ResponseWriter, r *http.Request) {
	var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(r *http.Request) bool { return true },
	}

	socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	log.Println("Client Connected")

	for i := 10; i < 510; i += 10 {
		for j := 10; j < 510; j += 10 {
			if err := socket.WriteMessage(websocket.TextMessage,
				[]byte(strconv.Itoa(j)+","+strconv.Itoa(i)+" ")); err != nil {
				log.Println(err)
				return
			}
			time.Sleep(1 * time.Millisecond)
		}
	}
	if err := socket.Close(); err != nil {
		log.Println(err)
		return
	}
}

func main() {
	http.HandleFunc("/", serve)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
