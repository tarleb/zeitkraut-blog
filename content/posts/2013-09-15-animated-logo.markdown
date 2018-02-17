---
title: Animated Logo
author: Albert Krewinkel
date: 2013-09-15
tags: svg, javascript, playground
---

Creating an animated version of the ZeitLens logo was just too tempting, so
here it is.  It was a fun little %SVG and JavaScript excercise.  Animating the
clock is as simple as calculating the angle of each dial from the current date
and then rotating the dial by that very angle.  Trivial, really.  The full code
is give below.

<div style="width:50%;">
<object type="image/svg+xml" data="/img/zeitlens-logo-animated.svg"
        class="img-responsive"></object>
</div>

### Code

#### SVG
``` xml
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [
  <!ENTITY mainColor "#2c7184">
]>
<svg viewBox="0 0 212 212"
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <style type="text/css">
      .handle, .dial, .centerpiece {
        fill: &mainColor;;
      }
    </style>
  </defs>

  <g transform="translate(100 100)">
    <!-- hours -->
    <g id="hourDial" class="hours" transform="rotate(310)">
      <rect class="dial"
            x="-11"
            y="-50"
            width="22"
            height="50"
            ry="16px"/>
    </g>
    <!-- minutes -->
    <g id="minuteDial" class="minutes" transform="rotate(60)">
      <rect class="dial"
            x="-10"
            y="-70"
            width="20"
            height="70"
            ry="14px"/>
    </g>
    <!-- seconds -->
    <g id="secondDial" class="seconds" transform="rotate(200)">
      <circle class="centerpiece"
              cx="0"
              cy="0"
              r="2"/>
      <rect class="dial"
            x="-2"
            y="-73"
            width="4"
            height="73"
            ry="5px"/>
    </g>
    <!-- clock center -->
    <circle class="centerpiece hours minutes"
            cx="0"
            cy="0"
            r="15"/>
  </g>
  <g class="lupe"
     transform="translate(100 100) rotate(45)">
    <!-- lens -->
    <circle class="lens"
            cx="0"
            cy="0"
            r="86"
            fill="none"
            stroke="&mainColor;"
            stroke-width="26px" />
    <!-- handle -->
    <rect class="handle"
          x="90"
          y="-30px"
          width="40"
          height="60px"
          rx="5px"/>
  </g>
  <script xlink:href="/scripts/animate-logo.js" type="text/ecmascript"></script>
</svg>

```

#### JavaScript (/scripts/animate-logo.js)

``` javascript
var updateClock = (function() {
  var sDial = document.getElementById("secondDial");
  var mDial = document.getElementById("minuteDial");
  var hDial = document.getElementById("hourDial");

  function moveDials(hours, minutes, seconds) {
    var hDeg = (360 / 12) * (hours + minutes/60);
    var mDeg = (360 / 60) * minutes;
    var sDeg = (360 / 60) * seconds;
    sDial.setAttribute("transform", "rotate("+sDeg+")");
    mDial.setAttribute("transform", "rotate("+mDeg+")");
    hDial.setAttribute("transform", "rotate("+hDeg+")");
  }

  function update() {
    var currentTime = new Date();
    moveDials(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
  };

  return update;
})();

// update every 50ms, just to be sure
setInterval(updateClock, 50);
```
