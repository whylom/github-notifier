$(function() {
  function notify(which) {
    var element = $("." + which).show();
    setTimeout(function() {
      element.fadeOut();
    }, 2500)
  }

  // Prepopulate text input with the previously saved token, if one exists.
  var textbox = $("input:text");
  textbox.val(localStorage["github_token"]);

  $("form").submit(function() {
    var token = textbox.val().replace(/^\s+/, "").replace(/\s+$/, "");
    if (token) {
      localStorage["github_token"] = token;
      notify("success");
    } else {
      notify("error");
    }
    $("input").blur();
    return false;
  });
});
