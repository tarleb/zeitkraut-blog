var zeitlens = (function() {
  function removeAllChildNodes(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    return node;
  };

  function hasClass(node, className) {
    return node.className.match(new RegExp("\\b" + className + "\\b"));
  }

  function createMailtoLink(address) {
    var link = document.createElement("a");
    link.href = "mailto:" + address;
    link.textContent = address;
    return link;
  }

  // convert obfuscated mail addresses into clickable "mailto:" links
  deobfuscateMailAddresses = function(mailAddressSelector, dontTouchClass) {
    var obfuscatedAddresses = document.querySelectorAll(mailAddressSelector);
    for (var i = 0; i < obfuscatedAddresses.length; i++) {
      var node = obfuscatedAddresses[i];
      console.log(node);
      if (!hasClass(node, dontTouchClass)) {
        removeAllChildNodes(node);
        node.className = "";
        var address = node.dataset.user + "@" + node.dataset.domain;
        node.appendChild(createMailtoLink(address));
      }
    }
  };

  return {
    deobfuscateMailAddresses: deobfuscateMailAddresses
  };
})();

document.addEventListener("readystatechange", function(event) {
  var mailAddressClass = "obfuscated-mail-address";
  zeitlens.deobfuscateMailAddresses(".obfuscated-mail-address", "dont-touch");
});
