(function(){
  var _md5 = null;
  try {
    _md5 = Cc['@mozilla.org/security/hash;1'].createInstance(Ci.nsICryptoHash);
  } catch (e) {
    liberator.echoerr(e);
  }

  // refference: http://rcrowley.org/2007/11/15/md5-in-xulrunner-or-firefox-extensions/
  function toMD5(url)
  {
    if (null == _md5) return '';

    // Build array of character codes to MD5
    var arr = [];
    var ii = url.length;
    for (var i = 0; i < ii; ++i)
    {
      arr.push(url.charCodeAt(i));
    }
    _md5.init(Ci.nsICryptoHash.MD5);
    _md5.update(arr, arr.length);
    var hash = _md5.finish(false);
    
    // Unpack the binary data bin2hex style
    var ascii = [];
    ii = hash.length;
    for (var i = 0; i < ii; ++i)
    {
      var c = hash.charCodeAt(i);
      var ones = c % 16;
      var tens = c >> 4;
      ascii.push(String.fromCharCode(tens + (tens > 9 ? 87 : 48)) + String.fromCharCode(ones + (ones > 9 ? 87 : 48)));
    }
    
    return ascii.join(''); 
  }

  commands.addUserCommand(
    ['delUrlView','duv'],
    'View delicious Bookmark Comment Page',
    function(args) {
      var hash = toMD5(buffer.URL);
      var url = "http://delicious.com/url/" + hash;
      if (args == "+n") url += "?show=notes_only";
      window.content.window.location.href = url;
    }
  );
})();
