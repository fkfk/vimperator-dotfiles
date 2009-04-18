(function(){
commands.addUserCommand(
  ['hateb[uview]','hv'],
  'View Hatena Bookmark Comment Page',
  function() {
    var url = "http://b.hatena.ne.jp/entry/" + buffer.URL;
    url = url.replace("#","%23");
    window.content.window.location.href = url;
  }
);
})();
