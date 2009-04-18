(
  function()
  {
    var password;
    var username;
    var passwordManager = Cc["@mozilla.org/login-manager;1"].getService(Ci.nsILoginManager);
    var statusText = "Now reading: " + buffer.title + " " + buffer.URL;

    function sendTwitter()
    {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://twitter.com/statuses/update.json", false, username, password);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send("status=" + encodeURIComponent(statusText) + "&source=Vimperator");
    
      liberator.echo("[Twitter] Your post was sent. " );
    }

    commands.addUserCommand(
      ['tweetthis[page]','ttp'],
      'Tweet This Page URL and Title.',
      function()
      {
        try
        {
          var logins = passwordManager.findLogins({}, "http://twitter.com","https://twitter.com",null);
          if(logins.length)
          {
            username = logins[0].username;
            password = logins[0].password;
            sendTwitter();
          }
          else if (liberator.globalVariables.twitter_username && liberator.globalVariables.twitter_password)
          {
            username = liberator.globalVariables.twitter_username;
            password = liberator.globalVariables.twitter_password;
            sendTwitter();
          }
          else
          {
            throw "Accont not found";
          }
        }
        catch(e)
        {
          liberator.echoerr(e);
        }
      }
    );
  }
)();
