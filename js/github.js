github = {
  urlRoot: "https://api.github.com",

  notifications: function(success, error) {
    this.get("/notifications", function(notifications, xhr) {
      success(notifications, github.timeToWait(xhr));
    }, error);
  },

  timeToWait: function(xhr) {
    var interval = xhr.getResponseHeader("X-Poll-Interval");
    return parseInt(interval) * 1000;
  },

  get: function(path, success, error) {
    $.ajax({
      type: "GET",
      url: this.urlRoot + path,
      data: { access_token: localStorage["github_token"] },

      success: function(data, status, xhr) {
        success(data, xhr);
      },

      error: function(xhr, status, errMsg) {
        error(errMsg);
      }
    });
  }
};
