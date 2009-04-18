// PLUGIN_INFO//{{{
var PLUGIN_INFO =
<VimperatorPlugin>
    <name>ssb</name>
    <description>View Stack Stock Books Page</description>
    <author mail="from.kyushu.island@gmail.com" homepage="http://d.hatena.ne.jp/from_kyushu/">from_kyushu</author>
    <version>0.1</version>
    <minVersion>1.2</minVersion>
    <maxVersion>2.0pre</maxVersion>
    <updateURL>http://svn.coderepos.org/share/lang/javascript/vimperator-plugins/trunk/ssb.js</updateURL>
    <detail><![CDATA[

== Command ==
ssb [stat]:
    View Stack Stock Books Page

== Stat ==
unread
reading
read
wish

== Example ==
:ssb
    View Stack Stock Books Page
:ssb unread
    Set "unread" this book

    ]]></detail>
</VimperatorPlugin>;
//}}}

(function(){
  function getAsin(uri)
  {
    //var regex = new RegExp("(ASIN|asin|dp|product|book|books)/([0-9]{9,13}[0-9Xx])");
    var regex = new RegExp("([0-9]{9,13}[0-9Xx])");
    var match = uri.match(regex);
    return (match == null ? null : match[0]);
  }

  // SSBのAPIを使ってISBNから書籍情報を取得
  function getBookInfo(isbn)
  {
    var uri = "http://stack.nayutaya.jp/api/book/";
    if (isbn.length == 10)
    {
      uri += "isbn10/" + isbn + ".json";
    }
    else if (isbn.length == 13)
    {
      uri += "isbn13/" + isbn + ".json";
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', uri, false);
    xhr.send(null);
    if (xhr.status != 200) {
        liberator.echoerr('false');
        return url;
    }
    return window.eval('(' + xhr.responseText + ')');
  }

  //SSBのAPIから書籍情報を取り、そこからISBN10(=ASIN)を取得
  function getIsbn10(isbn13)
  {
    var info = getBookInfo(isbn13);
    return info.response.book.isbn10;
  }

  commands.addUserCommand(
    ['ssb'],
    'View Stack Stock Books Page',
    function(args)
    {
      var asin = getAsin(buffer.URL);
      if (asin.length == 13)
      {
        asin = getIsbn10(asin);
      }
      var uri = "http://stack.nayutaya.jp/book/" + asin;
      switch (args)
      {
        case "unread":
        case "reading":
        case "read":
        case "wish":
          uri += "?state=" + args;
          break;
      }
      window.content.window.location.href = uri;
    }
  );
})();
