// PLUGIN_INFO//{{{
var PLUGIN_INFO =
<VimperatorPlugin>
  <name>bit.ly</name>
  <description>Copy Shorten URL by bit.ly</description>
  <description lang="ja">bit.lyの短縮URLをクリップボードにコピーします。</description>
  <author mail="from.kyushu.island@gmail.com" homepage="http://iddy.jp/profile/from_kyushu">from_kyushu</author>
  <version>0.1</version>
  <license>GPL</license>
  <minVersion>1.2</minVersion>
  <maxVersion>2.1</maxVersion>
  <updateURL>http://svn.coderepos.org/share/lang/javascript/vimperator-plugins/trunk/bit.ly.js</updateURL>
  <detail><![CDATA[

== Setting ==
>||
  let g:bit_ly_id = "userid"
||<
bit.lyに登録したユーザーIDを指定します。

>||
  let g:bit_ly_api_key = "api_key"
||<
bit.lyに登録した際に割り当てられたAPIキーを指定します。


  ]]></detail>
</VimperatorPlugin>;
//}}}
//
(function()
{
  api_url = "http://api.bit.ly/";
  id = liberator.globalVariables.bit_ly_id;
  key = liberator.globalVariables.bit_ly_api_key;
  version = "2.0.1";

  function checkSettings()
  {
    if (id == undefined || key == undefined)
    {
      liberator.echoerr("[BCP] Error! You must setting g:bit_ly_api_key and g:bit_ly_id in your .vimperatorrc.");
      return false;
    }
    else
    {
      return true;
    }
  };

  function getResponse(base,req)
  {
    var xhr = new XMLHttpRequest();
    xhr.open('GET',req, false);
    xhr.send(null);
    if (xhr.status != 200)
    {
      liberator.echoerr("[BCP] Error! Request Failed.");
      return;
    }
    res = window.eval('(' + xhr.responseText + ')');
    return res.results[base];
  };
    
  commands.addUserCommand(
    ['BitlyShorten','bshorten'],
    'Copy bit.ly Short URI',
    function(args)
    {
      if (checkSettings())
      {
        var lurl = args;
        if (lurl.length == 0)
        {
          lurl = buffer.URL;
        }
        var req = api_url+"shorten?version="+version+"&longUrl="+lurl+"&login="+id+"&apiKey="+key;
        var res = getResponse(lurl,req);
        util.copyToClipboard(res.shortUrl);
        liberator.echo("[BCP] Copy to clipboard.");
      }
    }
  );

  commands.addUserCommand(
    ['BitlyExpand','bexpand'],
    'Copy bit.ly long URL',
    function(args)
    {
      if (checkSettings())
      {
        if (args.length > 0)
        {
          var req = api_url+"expand?version="+version+"&shortUrl="+args+"&login="+id+"&apiKey="+key;
          var res = getResponse(args,req);
          util.copyToClipboard(res.longUrl);
          liberator.echo("[BCP] Copy to clipboard.");
        }
        else
        {
          liberator.echoerr("[bit.ly API] Error! require shortUrl or hash.");
        }
      }
    }
  );

})();
