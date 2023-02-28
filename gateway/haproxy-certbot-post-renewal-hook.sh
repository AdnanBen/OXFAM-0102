#!/usr/bin/env bash

# Place this file into /etc/letsencrypt/renewal-hooks/post/haproxy-certbot-post-renewal-hook.sh
#  and mark it executable (chmod +x /etc/letsencrypt/renewal-hooks/post/haproxy-certbot-post-renewal-hook.sh)
# See https://eff-certbot.readthedocs.io/en/stable/using.html#config-file for more information
# See https://serversforhackers.com/c/letsencrypt-with-haproxy for a similar guide (but that uses a different method)

host='oxfamsurvivorscommunity.uksouth.cloudapp.azure.com'

bash -c "cat /etc/letsencrypt/live/$host/fullchain.pem /etc/letsencrypt/live/$host/privkey.pem > /etc/letsencrypt/live/$host/haproxy.pem"

# Reload HAProxy
docker restart gateway-proxy-1
