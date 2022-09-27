usage="Usage: $(basename "$0") (websocket|webtransport|webrtc|direct-socket)"

if [ $# != 1 ]; then echo "$usage"; fi

cd "$1" || exit
go build .
go run main.go
