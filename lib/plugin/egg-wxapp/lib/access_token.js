'use strict';

class AccessToken {
  constructor(access_token, expires_time, expires_in) {
    this.access_token = access_token;
    this.expires_time = expires_time;
    this.expires_in = expires_in;
  }

  isValid() {
    return !!this.access_token && (Date.now() < this.expires_time);
  }
}

module.exports = AccessToken;
