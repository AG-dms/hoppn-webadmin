#!/bin/sh
echo "Start nginx"

# setup ssl keys
echo "ssl_key=${SSL_KEY:=le-key.pem}, ssl_cert=${SSL_CERT:=le-crt.pem}, ssl_chain_cert=${SSL_CHAIN_CERT:=le-chain-crt.pem}"
export LE_SSL_KEY=/etc/nginx/ssl/${SSL_KEY}
export LE_SSL_CERT=/etc/nginx/ssl/${SSL_CERT}
export LE_SSL_CHAIN_CERT=/etc/nginx/ssl/${SSL_CHAIN_CERT}

# create destination folders
mkdir -p /etc/nginx/conf.d
mkdir -p /etc/nginx/ssl

# collect services
SERVICES_FILES=$(find "/etc/nginx/" -type f -maxdepth 1 -name "service*.conf")

# copy service*.conf from /etc/nginx/ if they are mounted
if [ ${#SERVICES_FILES} -ne 0 ]; then
    cp -fv /etc/nginx/service*.conf /etc/nginx/conf.d/
fi

# replace SSL_KEY, SSL_CERT and SSL_CHAIN_CERT by actual keys
sed -i "s|SSL_KEY|${LE_SSL_KEY}|g" /etc/nginx/conf.d/*.conf 2>/dev/null
sed -i "s|SSL_CERT|${LE_SSL_CERT}|g" /etc/nginx/conf.d/*.conf 2>/dev/null
sed -i "s|SSL_CHAIN_CERT|${LE_SSL_CHAIN_CERT}|g" /etc/nginx/conf.d/*.conf 2>/dev/null

# replace LE_FQDN
sed -i "s|LE_FQDN|${LE_FQDN}|g" /etc/nginx/conf.d/*.conf 2>/dev/null

# generate dhparam.pem
if [ ! -f /etc/nginx/ssl/dhparam.pem ]; then
    cd /etc/nginx/ssl
    openssl dhparam -out dhparam.pem 2048
    chmod 600 dhparam.pem
fi

# disable configuration and let it run without SSL
mv -v /etc/nginx/conf.d /etc/nginx/conf.d.disabled

(
  # give nginx time to start
  sleep 5

  echo "Start updater"
  while :; do
    /le.sh

    # on the first run remove default config, conflicting on 80
    rm -f /etc/nginx/conf.d/default.conf 2>/dev/null
    # on the first run enable config back
    mv -v /etc/nginx/conf.d.disabled /etc/nginx/conf.d 2>/dev/null

    echo "Reload nginx with SSL"
    nginx -s reload
    sleep 10d
  done
) &

nginx -g "daemon off;"
