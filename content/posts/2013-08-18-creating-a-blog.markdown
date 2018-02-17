---
title: Creating a Blog
author: Albert Krewinkel
date: 2013-08-18
last-modified: 2013-12-17
tags: meta
---

I broke down and started to work on a blog again.  There are many good reasons
not to write a blog: it costs a lot of time, works as a very potent guild
inducer during periods with fewer updates, and renders it trivial to make
oneself look stupid to the entire internet.  On the other hand, I find writing
also to be challenging and a lot of fun, so here we go.

## Choosing a Blogging Software

More difficult than the decisions *if* to write a blog was *how* to write a
blog.  The number of blogging tools available is **huge**.  Choosing the right
one was harder than I thought.


### WordPress

My first blog a few years ago was based on [WordPress](https://wordpress.org).
It was fairly easy to set up, comfortable to use, but not without downsides:
First of all, it requires PHP and a SQL-database to be installed on the
server.  Well, this isn’t bad *per se*, but leaves me with a bit of an
uncomfortable feeling for no specific reason (maybe it reminds me of all the
bad software I’ve written using those tools).

Much worse, however, were the constant updates of WordPress versions.  Didn’t
update your blog for a month?  That’s fine, unless you prefer software without
multiple -- known and exploitable -- security problems.  Furthermore,
installed plugins happened to not be compatible with newly updated versions,
making the whole process even more unpleasant.  WordPress is an okay solution,
it’s just nothing I want for my blog right now.

### Org-Mode

The next thing I tried was [Emacs’ org-mode](https://orgmode.org).  I’ve
been depending org-mode for years.  I’m using it for everything from taking
notes, over birthday reminders, and up to handling my todos and keeping track
of e-mails to be answered.  Exporters exist to publish org-mode files as HTML
pages, so org-mode looked like a natural choice to me.  Unfortunately, the
adaptions necessary to shoehorning a note-taking and todo managing system into
a blogging software took more time than I had expected.  I have no doubt that
a few more hours of fiddling would have resulted in something usable (the
emacs ecosystem is amazing), yet that was more than I was willing to spend
that day.  Instead, I kept looking for alternatives.

### Hakyll

Long story short, I settled with [Hakyll](http://jaspervdj.be/hakyll/).  It is
easy to use, very well documented and even written in Haskell, a beautiful
language I’m still trying to wrap my head around.  At first, I tried to make
things work together with org-mode.  Patching
[pandoc](http://johnmacfarlane.net/pandoc/) to read .org files proved very
time consuming, so I’ll stick to markdown syntax for now.

## Making it look nice

I’ve always wanted to acquire some basic knowledge of
[bootstrap](http://getbootstrap.com); building this blog is the perfect
opportunity to do so.  Some adaptions were done, making use of colors taken
from the [solarized](http://ethanschoonover.com/solarized) color scheme.  More
customizations will follow.

The header picture, in case anyone was be wondering, was taken on Sylt.

I hope you like the result of my experiments.
