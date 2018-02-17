---
title: Re-Using SVG Graphics with Style
date: 2013-09-11
author: Albert Krewinkel
tags: svg, css, html, browsers
---

I like experimenting with new technology.
[%SVG](http://www.w3c.org/Graphics/SVG/) itself doesn’t exactly qualify as
"new" anymore, its first release dates back to the final months of the dot-com
bubble.  However, the inclusion of %SVG in %HTML5 and the ever increasing
browser support gives it a feeling of "oooh, shiny!".

The ZeitLens logo is simple and based on geometric shapes, so it was a very
obvious decision to hand-code it in %SVG.  Inclusion of the logo into the page
is straightforward and possible with a couple of options.  Things started
getting interesting when I decided to
[style the logo’s appearance with %CSS](http://www.w3c.org/TR/SVG11/styling.html#StylingWithCSS)
and to include the same logo *twice*.  Simple, right?  Here comes the fun.

## Imagine beautiful SVG images

The logo is an image, so using an `img` tag to include it into the page is the
most reasonable approach, at least from a semantic point-of-view.  This works
nicely in all recent browsers, but *only* if both code and styling information
are put into a single file.  Now that last part is really bad: The whole point
of %CSS is to separate the presentation from the data.  Including %CSS into the
%SVG-image file goes against modularity principles and limits re-usability.

Assume we would like to style the logo matching the documents text and
background colors.  Following the %DRY principle, these colors should be
defined exactly once, most likely in the central stylesheet.  This won’t work
for %SVG graphics included through `img` elements.  We would have to duplicate
the color information in the logo file.  Should we decide to change our main
style, we’d also have to visit each graphics file changing the colors there.
Using a technology like [%Sass](http://sass-lang.com) is out of the question,
too.  What a pain.

## Inline SVG

Let’s go the other way and directly include inline %SVG into the page.  We
could reference and hence re-use the image on the same page via `xlink`
attributes and `use` elements.  Styling information could be included into the
%HTML either as inline %CSS or with a `link` element pointing to a stylesheet.
In terms of modularity, this is a great improvement over the previous method.

Too bad it
[doesn’t work in Chrome](https://bugs.webkit.org/?show_bug.cgi?id=111927).
(Strangely enough, it *does* work with JavaScript disabled.)  The styles are
not applied to the cloned graphics.  We could try to style every clone
individually, but that even *must not* work.  The
[official %W3C recommendation](http://www.w3.org/TR/SVG/struct.html#UseElement)
states

    %CSS2 selectors cannot be applied to the (conceptually) cloned DOM tree
    because its contents are not part of the formal document structure.

Crap.  We can’t style the cloned graphics but have to duplicate the complete
inline %SVG in order to make it accessible to %CSS selectors.  This is no better
than using `img` elements.

## `object`ive %SVG

There is but one option left: `object` elements.  The stylesheet can be
specified in the %XML of the graphics and it is applied correctly.  Modularity
is ensured; content and styling are separated nicely.

Despite `object` elements working well in general, not all is good.  The
problem lies with Firefox 17 and [NoScript](http://noscript.net/).  At least
for me, a browser of this (or earlier) version will not display an `object`
when JavaScript is disabled.  The placeholder looks really ugly, too.  The
blog should be fully functional in a one year old browser, even with an
intrusive plugin like NoScript.  A page with major parts of its graphical
identity missing can hardly be described as *fully functional*.  Therefor
`object` tags are no silver bullet, either.

## This Blogs Method

While basic %SVG support in browsers is good in general, they still lack full
support for the specs.  It is possible to make good use of %SVG, but
([as with most newish internet standards](http://caniuse.com)) one has to be
careful about what does and doesn’t work.  As for this blog, you can have a
look at the source to check which ugly hack I resolved to for this blog.  At
the time of writing, I hard coded some sensible color values into the %SVG.
Only stylistic fine-tuning is done in %CSS.  I’m not happy about it, but that’s
the way it is for now.  I may change it once I find the time.

At least the logo came out okay.
