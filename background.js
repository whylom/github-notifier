/*
  background.js

    The main logic for this extension, which Chrome is kind enough to keep
    running in the background. It polls GitHub's notifications API, using the
    personal access token provided by the user in the options.

    If the user has any unread notifications, the extension's icon is badged
    with with the unread count. If any errors occur, the icon is badged with
    a red "!"

    Clicking on the extension's icon opens GitHub's notifications page in a
    tab If the user has not yet provided their GitHub personal access token,
    then clicking the icon opens the options page so they can enter it easily.
*/


// When the user clicks on this extension's icon, do 1 of 2 things based on
// whether we've already saved their GitHub personal access token.
chrome.browserAction.onClicked.addListener(function() {
  if (localStorage['github_token']) {
    // if we have the user's GitHub token, open their notifications page
    chrome.tabs.create({ url: "https://github.com/notifications" });
  } else {
    // otherwise, open the options page so they can enter their token
    chrome.tabs.create({ url: chrome.extension.getURL("options/options.html") });
  }
});

// The main loop, regularly checking GitHub for unread notifications.
(function() {
  var next = arguments.callee;

  if (localStorage['github_token']) {
    // If user has provided their token, get unread notifications.
    github.notifications(function(unread, timeToWait) {
      // Badge the icon with the # of unread notifications.
      badge.set(unread.length);

      // Wait the amount of time requested by GitHub before polling again.
      // TODO: also respect the rate limiting feedback provided by GitHub
      setTimeout(next, timeToWait);
    }, function() {
      // Indicate something went wrong while querying the GitHub API.
      // TODO: show some error messaging (in the tooltip or the options page)
      badge.error();
    });
  } else {
    // The user has not yet provided their token, so switch the badge to an
    // error state to indicate the user should click to enter their token.
    // (Clicking will open the options page while in this state.)
    badge.error();

    // Check every 2 seconds to see if the token has been entered yet.
    setTimeout(next, 2000);
  }
})();
