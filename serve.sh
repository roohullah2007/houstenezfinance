#!/usr/bin/env bash
# Keep `php artisan serve` alive. If it exits for any reason
# (memory, network blip, stray signal), relaunch it.
# Usage: ./serve.sh   — stops with Ctrl+C (trap below exits cleanly).

cd "$(dirname "$0")"

trap 'echo; echo "Stopping watcher."; exit 0' INT TERM

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-8000}"

echo "▶ Watching php artisan serve on http://$HOST:$PORT (Ctrl+C to stop)"
while true; do
    php artisan serve --host="$HOST" --port="$PORT"
    echo
    echo "⚠ artisan serve exited at $(date '+%H:%M:%S') — restarting in 1s…"
    sleep 1
done
