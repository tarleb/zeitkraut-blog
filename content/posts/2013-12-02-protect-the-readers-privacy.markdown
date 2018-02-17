---
title: Protect the Reader’s Privacy!
author: Albert Krewinkel
date: 2013-12-02
modified: 2013-12-17
tags: privacy, http
---

I was faced with potential privacy issues while integrating Dave Gandy’s
[Font Awesome](http://fontawesome.io) into the page.  The font itself is not
to blame.  On the contrary, the it is great!  The methods by which it can be
used, however, can be very problematic and open a channel for potential user
tracking.  This is not unique to this font but a very general problem.

The Font Awesome website
[lists multiple options](http://fontawesome.io/get-started) of how to
integrate the font into a website, most of which are fairly simple.  The first
method is also praised as the "easiest", yet I decided against it to protect
the blog readers’ privacy.  Here is why.

## Foreign vs. Local Content

Most projects aimed at websites and web development offer a very simple way of
using the technology: Including very short snippets of code is enough to bring
a wide range of new functionality to an otherwise plain site.  The principle
here is that a foreign server handles the content.  The page merely instructs
the browser to get that content and to mix it with what is received from the
original site.

As an example, this is the code which includes the popular
[jQuery](http://jquery.com) library into a page:

``` html
<script type="text/javascript" src="//code.jquery.com/jquery-1.10.2.min.js">
</script>
```

This instructs the browser to send a request to `code.jquery.com` and to
receive the library file from there.

Contrast this with

``` html
<script type="text/javascript" async="true" src="/scripts/jquery.min.js">
</script>
```

The latter HTML snippet causes no request to foreign servers but loads
everything from the currently visited domain.  The content must be put on the
server, but that is hardly ever a problem with open source projects.  This is
also the setup I chose for Font Awesome and other libraries used on this site.


## Information Disclosure

The privacy problem arising from the former inclusion method is inherent to
the way browsers communicate with servers.  All browser requests are sent with
the Hypertext Transfer Protocol, %HTTP for short.  When an %HTTP conforming
browser request goes out to a third-party server, that server learns about

- the address of the page which prompted the browser to initiate the request
  and
- the users IP address, operating system, browser version and other
  potentially identifying information.

In other words, the third-party is informed about the pages which are visited
and how frequently users view them.  The details of how much the third party
really learns about a visitor depend on a number of variables, including the
interest of the third party in user browsing-patterns.  Privacy friendly
third-party servers can stop a browser from making repeated requests for the
same resource, thereby preventing the browser from disclosing more than the
address of the first visited page.  However, one address is always disclosed,
regardless of server configuration.

It should be clear now that third-party website content poses a privacy risk
to website visitors.  Control over the disclosure of surfing habits and over
another method for user-tracking is handed over to a third party.  The website
creator chooses in the name of all visitors which other pages they have to
trust.  The visitor has no choice in
this.^[ Some commercial websites are well aware of the problem: The social
news site [reddit](http://reddit.com) offers a privacy related option to
<q>*"load core %JS libraries from reddit servers"*</q>.  It sets an example
of how a website can give control in this matter back to the users.
Unfortunately, the option became worthless when reddit decided to track its users
with Google Analytics, eliminating all hopes for good privacy on that site.
The JavaScript tracking code is loaded from Google’s servers regardless of
whether the above option is set or not.]



## Responsibility of Webmasters

Including foreign content on a page is very common on the web, yet it is
rarely ever necessary.  Website operators are given the trust and data of
their users.  They should act responsibly and handle requests confidentially.
Most importantly, they should not hand over user data to others.  Setting
foreign website content aside is one of the basic measures a webmaster should
take to protect their users’ privacy.
