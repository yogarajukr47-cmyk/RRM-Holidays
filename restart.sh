#!/bin/bash
# RRM Holidays - Infinite restart wrapper
cd /home/z/my-project
while true; do
  fuser -k 3000/tcp 2>/dev/null
  sleep 1
  node server.js &
  SRV_PID=$!
  sleep 50
  kill $SRV_PID 2>/dev/null
  wait $SRV_PID 2>/dev/null
done
