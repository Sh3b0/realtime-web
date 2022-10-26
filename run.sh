usage="Usage: $(basename "$0") (client|websocket|webtransport|webrtc)"

if [ $# != 1 ]; then echo "$usage"; fi

cd "$1" || exit
go run main.go
