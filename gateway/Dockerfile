FROM haproxy:2.7
# COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg
COPY docker-entrypoint.sh /docker-entrypoint.sh

# VOLUME haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg

# ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]