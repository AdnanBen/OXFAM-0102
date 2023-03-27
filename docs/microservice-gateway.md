The `gateway` microservice is an instance of [HAProxy](https://www.haproxy.org/), a TCP/HTTP load balancer.

It performs the following actions:

- proxies HTTP requests to the root domain to the various microservices based on the path
  This is configured in the `haproxy.cfg` configuration file within the microservice.

  ACLs are used to set `path_beg` rules, and used to select different backends based on the path.

  For example:

  ```
  frontend fe
    bind :80
    bind :443
    mode http
    acl path_forum path_beg /api/forum
    use_backend forum if path_forum
  backend forum
    balance roundrobin
    http-request replace-path /api/forum/(.*) /\1
    server s1 host.docker.internal:8002 check maxconn 30
    server s2 host.docker.internal:8003 check maxconn 30
  ```

- validates JWTs for moderator APIs
  ACLs are also configured for paths beginning with `/api/moderator` to determine if authentication is required for a given request.

  If authentication is required, the `next-auth.session-token` Cookie is extracted and if it exists, the JWT is validated (against the secret). Access is denied if the JWT does not exist or is expired.

- performs rate limiting
  Page accesses are stored in tables (called stick tables) and the access rate is calculated to determine if a user is sending requests too quickly. In our case, we have opted to calculate the 5 second request rate i.e. how many requests are made every 5 secs. Any path starting with /api is limited to 2 requests per second, except for auth endpoints starting with /api/auth which are limited to 10 requests per 5 seconds. Additionaly, endpoints starting with /api/moderator or /admin are not rate limited. This is because we assume moderators or admins will not abuse the system. Any other endpoint on the website is limited to 10 requests per 5 seconds. However, we do not include the download of website resources when calculating access rates, for example, when downloading .js or .css files we do not count these towards the allowed rate quota.

- performs load balancing
  Each microservice can use a different load balancing strategy. In the example above, `roundrobin` has been chosen to balance requests between the two servers `s1` and `s2`.
