# securify


so, have a server,
and send it database customizations with http post.

replicate the snapshots between all instances.
(but for now, just a single instance)

Each instance gets a shoe server,
and can handle it's own pipes.
when a connection comes in,
it's routed to the correct db on it's path...

if there are multiple dbs, then route to the server that connection lives on.

every instance is a loadbalancer.

## self-similar?

hmm, so if I have a section that has http...
then I could just use that for the server.

just stick files directly into levelup.

POST /taco/myid < bundle.json

(which also gets replicated...)

you could also use a static http thing to host your static pages
directly from the database...

we'd just need a load balancer, and subdomain proxies.

## updating

when a db is updated, take it down, destroy all connections
then start it again.




``` js
function () {
  return foo;

}
```

## License

MIT
