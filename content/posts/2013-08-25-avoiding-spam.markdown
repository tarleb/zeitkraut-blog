---
title: Avoid Mail Harvesting through Address Munging
author: Albert Krewinkel
date: 2013-08-25
tags: spam, address-munging, html, css, javascript
---

Spam just doesn’t die.  Every major mail provider has really good spam filters
in place, as do the common mail clients.  Nontheless, there seem to be enough
people reading -- and acting on -- spam mail to make it a profitable business.
No matter how much we hate it, we need to deal with spam.

Better than having a good spam filter is not to be spammed in the first place.
Since nobody can sent me unsolicited bulk mail if they don’t know my mail
address, keeping the mail address as private as possible is the way to go
here.  But what if we *want* our e-mail address to be public for other people
to reach us?  Adding minor obstacles to make it just a bit more difficult for
spammers to get the address can be enough.

##  Address Munging

The usual way for spammers to collect email addresses is to crawl websites and
to harvest everything that looks like a valid mail address.  A common defense
is [address munging](https://en.wikipedia.org/wiki/Address_munging),
i.e. resolving to bogus comments, additional markup, images or javascript to
hide mail addresses from automatic harvesters.  I find the use of images or
javascript problematic for various reasons and just dislike unnecessary
comments.  Luckily, %HTML5 and %CSS3 make it really easy to mangle addresses
without using either of these methods.

## Obfuscating an Address with HTML5 & CSS3

Our approach here leverages the %HTML5
[`data-*`](http://www.w3.org/TR/html5/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
attributes as well as the
[`::before`](https://developer.mozilla.org/en-US/docs/Web/CSS/::before) and
[`::after`](https://developer.mozilla.org/en-US/docs/Web/CSS/::after)
pseudo-elements.  The mail address is divided and stored in custom data
attributes and displayed as pseudo-elements.  The address is kept in the
markup, the presentation is handled in the style sheet:

HTML:

``` html
<span data-user="john.doe"
      data-domain="example.com"
      class="obfuscated-mail-address"><!--
-->@<span>obfuscated email address</span></span>
```

CSS:

``` css
.obfuscated-mail-address::before {
  content: attr(data-user);
}
.obfuscated-mail-address::after {
  content: attr(data-domain);
}
.obfuscated-email-address > * {
  display: none;
}
```

The result is readable, but can be neither selected nor copied:

<span data-user="john.doe"
      data-domain="example.com"
      class="obfuscated-mail-address dont-touch"><!--
--><span>obfuscated email address</span></span>

The nested `<span>` and its styling could be omitted, without changing the
presentation in most browsers.  We use it to ensures that everything fails
gracefully in browsers with limited %CSS support.  To see why this matters,
have a look at this page in a text browser like *w3m* or *links*.


## Drawbacks

The biggest advantage of this method is also it’s biggest disadvantage: The
semantics are broken.  The classic markup-code

``` HTML
<a href="mailto:me@example.com">John Doe</a>
```

is rendered as <a href="mailto:me@example.com">John Doe</a> and makes it very
clear, to machines and humans alike, that *John Doe* can be reached at
*me@example.com*.  Address munging, like the above, preserves this meaning for
humans, but takes it away for machines.  For better and for worse, browsers,
search engines, and spam bots will not be aware of the meaning of the
obfuscated address.

These effects can be alleviated by resolving to additional javascript:

``` javascript
// convert obfuscated mail addresses into clickable "mailto:" links
jQuery("document").ready(function($) {
  var mailAddressClass = "obfuscated-mail-address";
  $("."+mailAddressClass).each(function() {
    var address = $(this).attr("data-user") + "@" + $(this).attr("data-domain");
    $(this).html($("<a href=\"mailto:" + address + "\">" + address + "</a>", {}));
    $(this).removeClass(mailAddressClass);
  });
});
```

The webpage is still usable with JavaScript turned off, and even fails
gracefully on text-only browsers.  If JavaScript is available, the obfuscated
links offer the same experience as properly coded `<a
href="mailto:...">...</a>` links: <span data-user="john.doe"
data-domain="example.com" class="obfuscated-mail-address">@</span>.  I believe
this to be a very good trade-off between usability and safety from harvesters.
