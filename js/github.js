github = {
  notifications: function(callback) {
    var self = this;
    $.ajax({
      type: "GET",
      url: "https://api.github.com/notifications",
      data: { access_token: localStorage["github_token"] },

      success: function(notifications, status, xhr) {
        callback(notifications, self.timeToWait(xhr));
      },

      error: function(xhr, status, err) {
        // Log the error for debugging and wait a minute before trying again.
        console.log(err);
        callback([], 60 * 1000);
      }
    });
  },

  timeToWait: function(xhr) {
    // How many more requests we can make before GitHub rate limits this token.
    // This is usually a nice high number like 5000.
    var requestsRemaining = xhr.getResponseHeader("X-RateLimit-Remaining");

    // But if we only have a handful left before we get rate limited...
    if (parseInt(requestsRemaining) < 10) {
      // ...wait until the rate limit resets before making another request.
      // This is usually 1 hour.
      var reset = new Date(xhr.getResponseHeader("X-RateLimit-Reset") * 1000);
      var now = new Date();
      return Math.ceil((reset - now) / 60);
    } else {
      // We don't have to worry about rate limiting, so wait for the interval
      // suggested by GitHub before making another request. This is usually 60
      // seconds, but might be more if they need to reduce load on their API.
      return xhr.getResponseHeader("X-Poll-Interval") * 1000;
    }
  }
};
