#!/bin/bash
# Kill any existing server on port 3000
fuser -k 3000/tcp 2>/dev/null
sleep 1
# Start fresh
cd /home/z/my-project
(node /home/z/my-project/keepalive.js </dev/null &>>/tmp/keepalive.log &)
echo "$(date): Server restarted" >> /tmp/keepalive-errors.log
