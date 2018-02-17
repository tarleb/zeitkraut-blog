---
title: Exploring HTTP Headers with <code>netcat</code>
author: Albert Krewinkel
date: 2013-11-05
tags: command-line, http, shell script, linux
---

One of the many great things about free and open source software and the whole
GNU/Linux ecosystem are the simple yet powerful tools available.  The
possibilities enabled by almost trivial programs are incredible.  A very
positive side effect this has on me is that I like to go and explore
technologies with the tools at my disposal.  My latest experiments revolved
around the %HTTP protocol, specifically %HTTP headers, and very basic open
source networking tools.

## The HyperText Transfer Protocol

Webservers on the internet sending a website to a browser use the HyperText
Transfer Protocol (%HTTP) to do so.  Along with the HTML data for the page
itself, the server answer includes additional information: Response code,
cookies, and how the browser or proxy server should handle the contents is
transfered within the *%HTTP header*.  The ability of the headers to control
state on the client side is what makes them so interesting and the reason why
we are going to have a closer look at them.

## Communicating with `netcat`

Instead of building our own %HTTP client and server implementations -- that
would be total overkill -- we restrict the goal to a simple networking tool
that can be made to receive, send and alter basic %HTTP commands: `netcat`, the
self-described TCP/IP swiss army knife, combined with basic shell scripts.

We start by setting up a basic echoing server which sends everything back the
same way it was received.

``` shell
nc -l -p 8042 -e '/bin/cat'
```

Pointing the browser at `http://localhost:8042`, then killing the `netcat`
process manually by hitting `Control-C`, we can see the headers we sent within
our browser.  Everything that is send to our simple server is put through the
`cat` program, which just passes it on to STDOUT, which is then sent back to
the connecting browser.  The process has to be terminated manually, as it
doesn’t know when to stop listening for more input.  It’s crude, yet
effective.

## Shell Scripting for more advanced features

The above is neither comfortable to use nor very good to toy with, so we
replace `cat` with a script of our own, we’ll call it `exploring-http.sh`:

``` shell
#!/bin/sh

# Keep reading everything until we hit the first empty line
read_headers ()
{
    read i
    while [ -n "$i" ] &&
          [ "$(echo -n "\r\n")" != "$i" ] &&
          [ "$(echo -n "\n")" != "$i" ]
    do
        echo "$i"
        read i
    done
}
request_headers="$(read_headers)"

# Get some response headers ready
response_headers ()
{
    printf "HTTP/1.1 200 OK\r\n"
    printf "Content-Type: text/plain\r\n"
    printf "\r\n"
}

# Send the response
respond ()
{
    local response_headers="$(response_headers)"
    echo "${response_headers}"
    echo "Browser Request Headers"
    echo "======================="
    echo "$request_headers"
    echo "\r\n"
    echo "Server Response Headers"
    echo "======================="
    echo "${response_headers}"
}

respond
```

The request send by the browser is read till we reach the first black line,
signaling the end of the request header.  This time, we follow the protocol by
prefixing the content with very simple response headers before sending it back
to the browser.  We also don’t have to manually terminate our `netcat` server,
it terminates after answering to the request.  Starting it again after each
request is tedious, so we automate it and put it into a loop, restarting the
server immediately once it terminates.

``` shell
sh -c 'while true; do nc -l -p 8042 -e exploring-http.sh; done'
```

Now we are free to experiment with %HTTP headers and the way browser and server
interact.  For example, we can let the server add a `Last-Modified` header,
the content of which should be sent back by the browser in the next request:

``` shell
response_headers ()
{
    printf "HTTP/1.1 200 OK\r\n"
    printf "Content-Type: text/plain\r\n"
    printf "Last-Modified: $(date --rfc-2822)\r\n"
    printf "\r\n"
}
```

Reloading twice, and the browser request will change to send an additional
`If-Modified-Since` header.

## ETags

The functionality of ETags, designed to communicate caching of old files, can
be used follow users around without the need of cookies.  Let’s see if we
can do this with our little server.

The function generating the response headers is modified to extract any ETag
supplied by the browser.  If none exists, we generate a new one by hashing the
number of nanoseconds passed since the beginning of the UNIX epoche.  The
parsed or newly generated etag is then sent back to the browser.  We also add
a few header to make sure the conents isn’t cached.  As a result, we should be
able to track a user through his or her browser cache.

```shell
response_headers ()
{
    local etag
    etag=$(echo "${request_headers}" | sed -ne 's/^\(If-None-Match: "\([a-f0-9]*\)".*\)/\2/gp')
    printf "HTTP/1.1 200 OK\r\n"
    printf "Content-Type: text/plain\r\n"
    printf "Last-Modified: $(date --rfc-2822)\r\n"
    printf "ETag: \"${etag:-$(date +%s%N | md5sum | cut -d' ' -f1)}\"\r\n"
    printf "Expires: Tue, 01 Jan 2013 00:00:01 GMT\r\n"
    printf "Cache-Control: max-age=0\r\n"
    printf "Connection: keep-alive\r\n"
    printf "\r\n"
}
```

We can test this by reloading our test page twice and&hellip; it works!  We
can reload as often as we want, the ETag header sent by the browser will not
change unless we clear the browser’s cache.  A stealthy kind of user tracking
can be simulated with just a few lines of shell script.

## Conclusion

Even though we used nothing but simple command line tools and shell scripting,
we managed to build a simple server and to experiment with the ways in which
stateless servers and stateful browseres can effect each other through %HTTP
headers.  Standard UNIX tools are very powerful by themselves; together with a
tool like `netcat`, power and fun extend even into experiments with networking
and default protocols.
