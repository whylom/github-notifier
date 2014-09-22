badge = {
  text: function(text) {
    chrome.browserAction.setBadgeText({ text: text.toString() });
  },

  background: function(color) {
    chrome.browserAction.setBadgeBackgroundColor({ color: color });
  },

  reset: function() {
    this.text("");
    this.background("#333");
  },

  set: function(text) {
    if (text.toString() === "0") {
      // instead of showing "0" in badge, show nothing
      this.reset();
    } else {
      this.text(text);
      this.background("#333");
    }
  },

  error: function() {
    this.text("?");
    this.background("#FF0000");
  }
};
