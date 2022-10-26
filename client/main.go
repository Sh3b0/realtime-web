package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	fmt.Println("Serving static files at :3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
