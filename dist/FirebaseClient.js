"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SERVER_KEY = "AIzaSyA7eao_wnLiS-hdU9r7-KQuPcpq7tPJYXs";
var API_URL = "https://fcm.googleapis.com/fcm/send";

var FirebaseClient = function () {
  function FirebaseClient() {
    _classCallCheck(this, FirebaseClient);

    this.sendData = this.sendData.bind(this);
    this.sendNotification = this.sendNotification.bind(this);
    this.sendNotificationWithData = this.sendNotificationWithData.bind(this);
  }

  _createClass(FirebaseClient, [{
    key: "sendNotification",
    value: function sendNotification(token) {
      var body = {
        "to": token,
        "notification": {
          "title": "Simple FCM Client",
          "body": "This is a notification with only NOTIFICATION.",
          "sound": "default",
          "click_action": "fcm.ACTION.HELLO"
        },
        "priority": 10
      };

      this._send(JSON.stringify(body), "notification");
    }
  }, {
    key: "sendData",
    value: function sendData(token) {
      var body = {
        "to": token,
        "data": {
          "title": "Simple FCM Client",
          "body": "This is a notification with only DATA.",
          "sound": "default",
          "click_action": "fcm.ACTION.HELLO",
          "remote": true
        },
        "priority": "normal"
      };

      this._send(JSON.stringify(body), "data");
    }
  }, {
    key: "sendNotificationWithData",
    value: function sendNotificationWithData(token) {
      var body = {
        "to": token,
        "notification": {
          "title": "Simple FCM Client",
          "body": "This is a notification with NOTIFICATION and DATA (NOTIF).",
          "sound": "default",
          "click_action": "fcm.ACTION.HELLO"
        },
        "data": {
          "title": "Simple FCM Client",
          "body": "This is a notification with NOTIFICATION and DATA (DATA)",
          "click_action": "fcm.ACTION.HELLO",
          "remote": true
        },
        "priority": "high"
      };

      this._send(JSON.stringify(body), "notification-data");
    }
  }, {
    key: "_send",
    value: function _send(body, type) {
      var headers = new Headers({
        "Content-Type": "application/json",
        "Content-Length": parseInt(body.length),
        "Authorization": "key=" + SERVER_KEY
      });

      fetch(API_URL, { method: "POST", headers: headers, body: body }).then(function (response) {
        return console.log("Send " + type + " response", response);
      }).catch(function (error) {
        return console.log("Error sending " + type, error);
      });
    }
  }]);

  return FirebaseClient;
}();

var firebaseClient = new FirebaseClient();
exports.default = firebaseClient;