FROM nginx:mainline-alpine

COPY ./public/dist ./usr/share/nginx/html

RUN apk add --no-cache --update certbot tzdata openssl

COPY nginx/scripts/entrypoint.sh /entrypoint.sh
COPY nginx/scripts/le.sh /le.sh

RUN \
  rm -f /etc/nginx/conf.d/default.conf && \
  chmod +x /entrypoint.sh && \
  chmod +x /le.sh

CMD ["/entrypoint.sh"]
