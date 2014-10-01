icon = {
  badge: function(text, color) {
    chrome.browserAction.setBadgeText({ text: text.toString() });
    chrome.browserAction.setBadgeBackgroundColor({ color: color });
  },

  enable: function() {
    chrome.browserAction.setIcon({ path: "icons/19.png" });
  },

  disable: function() {
    chrome.browserAction.setIcon({ path: "icons/19-gray.png" });
  },

  reset: function() {
    this.disable();
    this.badge("", "#333");
  },

  notify: function(number) {
    if (number.toString() === "0") {
      // instead of showing "0" in badge, show nothing
      this.reset();
    } else {
      this.enable();
      this.badge(number, "#333");
    }
  },

  error: function() {
    this.enable();
    this.badge("?", "#FF0000");
  }
};
