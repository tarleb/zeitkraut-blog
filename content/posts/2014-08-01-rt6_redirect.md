---
title: 'rt6_redirect: source isn''t a valid nexthop for redirect target'
author: Albert Krewinkel
date: 2014-08-01
tags: security, ipv6, server
---

The zeitkraut server is configured to work with IPv6.  For quite some time
now, I've been seeing some strange errors in my log files.  If you've been
noticing something similar, here is what's going on and how to prevent the
messages from appearing.

## The Problem

Everything works as expected, except for some weird messages in the logs:

```
rt6_redirect: source isn't a valid nexthop for redirect target
```

Not even [startpage](https://startpage.com) was of much help.  Searching for
the above line only lists only some
[unanswered](http://ubuntuforums.org/archive/index.php/t-1947743.html)
[forum](http://board.gulli.com/thread/1699675-rt6-redirect-source-isn-t-a-valid-nexthop/)
questions and the kernel source code which is producing the message.  Oh, and
a somewhat unhelpful blog entry
[telling](https://www.kernel-error.de/kernel-error-blog/189-rt6-redirect-source-isn-t-a-valid-nexthop-for-redirect-target)
people to always use their routers link local address when routing.  This is
useless advice in my case, I don't *have* a link-local address of the router,
only it's global address.


## The Cause

I found a way to stop the message from appearing in my logs.  On the way, I
learned a bit more about IPv6 and improved server security on the way.

IPv6 contains functionality to tell a computer about better routes to the
target destination.  A router may send ICMPv6 redirect packages (type 137 to
be specific), informing neighboring computers about more effective ways to
reach their targets.  This makes the most sense when applied within an
environment heavily relying on auto-configuration -- like a dynamic internal
company or home network.  It makes a lot less sense for servers very stable
network topologies.

Attackers may try to exploit the redirect functionality by including
themselves into the route to the target.  The specification for those
redirects includes some security-measures, requiring the attacker to correctly
guess the server's current next hop.  If the attackers get it wrong, the Linux
kernel refuses to use the new routing information.  This is most-likely what
happens when you see the above log messages.

## The Solution

Long talk short, the solution is to disable IPv6 redirecting:

    sudo sysctl net.ipv6.conf.all.accept_redirects=0

My server is not a router, so there is no need to accept any kind of route
changing messages from external sources.  We can simply disable redirects,
using above command.  The change can be made permanent by setting the value in
`/etc/sysctl.conf`.  In fact, we can disable routing for both IPv4 and IPv6.
Be careful though, you might happen to be in a network environment requiring
you to accept redirect commands for some reason.

If you are on Debian or similar distribution like Ubuntu, change the following
lines in `/etc/sysctl.conf` from

    # Do not accept ICMP redirects (prevent MITM attacks)
    #net.ipv4.conf.all.accept_redirects = 0
    #net.ipv6.conf.all.accept_redirects = 0
    # _or_
    # Accept ICMP redirects only for gateways listed in our default
    # gateway list (enabled by default)
    # net.ipv4.conf.all.secure_redirects = 1
    #
    # Do not send ICMP redirects (we are not a router)
    #net.ipv4.conf.all.send_redirects = 0
    #
    # Do not accept IP source route packets (we are not a router)
    #net.ipv4.conf.all.accept_source_route = 0
    #net.ipv6.conf.all.accept_source_route = 0

to

    # Do not accept ICMP redirects (prevent MITM attacks)
    net.ipv4.conf.all.accept_redirects = 0
    net.ipv6.conf.all.accept_redirects = 0
    #
    # Do not send ICMP redirects (we are not a router)
    net.ipv4.conf.all.send_redirects = 0
    #
    # Do not accept IP source route packets (we are not a router)
    net.ipv4.conf.all.accept_source_route = 0
    net.ipv6.conf.all.accept_source_route = 0

Running `sudo sysctl -p` loads the new settings.


## Alternative Solution

Completely disabling redirects in the kernel should keep you reasonably
secure.  However, if you need redirects within your internal network, you
could also block redirect packages reaching you through external interfaces.
E.g., to block redirect packages coming in on eth1, one would issue

    sudo ip6tables -A -i eth1 -p icmpv6 --icmpv6-type 137 -j DROP

However, firewall configuration is a complex topic, so I'm not going to go
into details here.

If you have any questions, corrections or comments on the matter, please drop
me a line.
