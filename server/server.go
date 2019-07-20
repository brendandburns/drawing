package main

import (
	"flag"
	"log"
	"net/http"
)

var (
	addr = flag.String("a", ":8080", "Address to serve on")
	dir = flag.String("d", "./", "Directory to serve from")
	token = flag.String("t", "", "Token for the recognition API")
)

func returnToken(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(200);
	w.Write([]byte(*token))
}

func main() {
	flag.Parse()

	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir(*dir))))
	http.HandleFunc("/token", returnToken)
	log.Printf("Serving on %s", *addr)
	log.Fatal(http.ListenAndServe(*addr, nil))
}