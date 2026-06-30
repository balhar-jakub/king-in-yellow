#!/bin/bash
# ──────────────────────────────────────────────────
# King in Yellow — Server Setup (run as root)
# Server: 193.150.13.68
# ──────────────────────────────────────────────────
set -e

echo "=== 1. Install certbot + nginx plugin ==="
apt-get update -qq && apt-get install -y certbot python3-certbot-nginx

echo ""
echo "=== 2. Create nginx config for plesvezlute.cz ==="
cat > /etc/nginx/sites-available/plesvezlute.cz << 'NGINX'
# HTTP → HTTPS redirect
server {
    listen 80;
    server_name plesvezlute.cz www.plesvezlute.cz;
    return 301 https://$host$request_uri;
}

# HTTPS
server {
    listen 443 ssl;
    server_name plesvezlute.cz www.plesvezlute.cz;

    # SSL certs will be added by certbot below

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}
NGINX

echo ""
echo "=== 3. Enable the site ==="
ln -sf /etc/nginx/sites-available/plesvezlute.cz /etc/nginx/sites-enabled/plesvezlute.cz

echo ""
echo "=== 4. Get SSL certificates via Let's Encrypt ==="
certbot --nginx -d plesvezlute.cz -d www.plesvezlute.cz --non-interactive --agree-tos --email balharjakub@gmail.com

echo ""
echo "=== 5. Test & reload nginx ==="
nginx -t && systemctl reload nginx

echo ""
echo "=== 6. Create systemd service for Next.js app ==="
cat > /etc/systemd/system/king-in-yellow.service << 'SYSTEMD'
[Unit]
Description=King in Yellow — Ve Žluté Next.js app
After=network.target

[Service]
Type=simple
User=balda
WorkingDirectory=/home/balda/king-in-yellow
ExecStart=/home/balda/.nvm/nvm-exec next start -p 8081 -H 127.0.0.1
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=NODE_OPTIONS=--unhandled-rejections=warn
Environment=PATH=/home/balda/.nvm/versions/node/v22.22.2/bin:/usr/local/bin:/usr/bin:/bin

[Install]
WantedBy=multi-user.target
SYSTEMD

echo ""
echo "=== 7. Enable & start the service ==="
systemctl daemon-reload
systemctl enable king-in-yellow
systemctl start king-in-yellow

echo ""
echo "=== Done! ==="
echo "Check status:  systemctl status king-in-yellow"
echo "Check nginx:   nginx -t && systemctl status nginx"
echo "Test:          curl -k https://plesvezlute.cz/"
