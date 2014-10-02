/*
  background.js

    The main logic for this extension, which Chrome is kind enough to keep
    running in the background. It polls GitHub's notifications API, using the
    personal access token provided by the user in the options.
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

  icon.reset();

  // If there is no internet connection, try again in 10 seconds
  if (!window.navigator.onLine) return setTimeout(next, 10000);

  if (localStorage['github_token']) {
    // If user has provided their token, get unread notifications.
    github.notifications(function(unread, timeToWait) {
      // Badge the icon with the # of unread notifications. Then try again
      // after waitingthe amount of time requested by GitHub.
      icon.notify(unread.length);
      setTimeout(next, timeToWait);
    });
  } else {
    // The user has not yet provided their token, so switch the badge to an
    // error state to indicate the user should click to enter their token.
    // (Clicking will open the options page while in this state.)
    icon.error();

    // Check every 2 seconds to see if the token has been entered yet.
    setTimeout(next, 2000);
  }
})();
