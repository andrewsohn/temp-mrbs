'use strict';

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _fcmNode = require('fcm-node');

var _fcmNode2 = _interopRequireDefault(_fcmNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;(function (DB, FCM) {
	'use strict';

	// get Today Date Format YYYYMMDD

	var todayDate = new Date();
	var mm = todayDate.getMonth() + 1; // getMonth() is zero-based
	var dd = todayDate.getDate();
	var curDate = [todayDate.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');

	// get Current Hour
	var trgDate = new Date(todayDate.getTime() + 60 * 60 * 1000);
	var curHour = Math.ceil(trgDate.getHours());

	// test value
	curDate = 20170512;
	curHour = 16;

	var config = {
		"unitRange": "ABCD",
		"message": {
			"title": "회의실 5분 알람",
			"content": "회의실에서 회의 미팅이 5분 뒤에 진행됩니다."
		},
		"dbConfig": {
			"apiKey": "AIzaSyDEw1aAAlX3QjD_zXJewFeuPao799TwZd0",
			"authDomain": "bookmeetingroom-150ca.firebaseapp.com",
			"databaseURL": "https://bookmeetingroom-150ca.firebaseio.com",
			"storageBucket": "bookmeetingroom-150ca.appspot.com",
			"messagingSenderId": "765500703433"
		},
		"notiConfig": {
			"SERVER_KEY": 'AIzaSyA7eao_wnLiS-hdU9r7-KQuPcpq7tPJYXs',
			"API_URL": "https://fcm.googleapis.com/fcm/send"
		}
	};

	var wait1000 = function wait1000() {
		return new Promise(function (resolve, reject) {
			setTimeout(resolve, 3000);
		});
	};

	var send = function send(data) {
		return new Promise(function (resolve, reject) {
			console.log(data);
			setTimeout(resolve, 3000);
		});
	};

	var endProcess = function endProcess() {
		// Node Shut Down
		process.exit();
	};

	var resData = {};

	wait1000().then(function () {
		console.log('Step 1 :: DB initialized !');
		DB.initializeApp(config.dbConfig);
		return wait1000();
	}).then(function () {
		console.log('Step 2 :: get Data !');

		var database = DB.database().ref();

		database.child("NotificationGroup/").once('value', function (notiData) {

			var notifications = notiData.val();

			database.child("UserData/").once('value', function (usersData) {
				var users = usersData.val();

				// console.log("notice: ", notifications);

				if ("undefined" !== typeof notifications[curDate]) {

					_underscore2.default.each(notifications[curDate], function (rowDateData, rowDateKey, rowDateList) {

						var alphabet = config.unitRange.split("");

						_underscore2.default.each(alphabet, function (letter) {

							if ("undefined" !== typeof rowDateData[letter]) {

								if ("undefined" !== typeof rowDateData[letter][curHour]) {

									if ("undefined" == typeof resData[rowDateKey]) resData[rowDateKey] = {};
									resData[rowDateKey][letter] = [];

									// Members
									if ("undefined" !== typeof rowDateData[letter][curHour].users.members) {
										_underscore2.default.each(rowDateData[letter][curHour].users.members, function (userId, i) {
											if ("undefined" !== typeof users[userId].userPushToken) {
												resData[rowDateKey][letter].push(users[userId].userPushToken);
											}
										});
									}

									// Owner
									if ("undefined" !== typeof rowDateData[letter][curHour].users.owner) {
										var ownerUserId = rowDateData[letter][curHour].users.owner;
										resData[rowDateKey][letter].push(users[ownerUserId].userPushToken);
									}
								}
							}
						});
					});
				}
			});
		});

		return wait1000();
	}).then(function () {
		console.log('Wheeyee! -> ', resData);

		async function _send(cb, userToken) {
			console.log(userToken);
			var fcm = new FCM(config.notiConfig.SERVER_KEY);

			var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera) 
				to: userToken,
				collapse_key: 'Meeting Room Alarm',

				"notification": {
					"title": "Simple FCM Client",
					"body": "This is a notification with only NOTIFICATION.",
					"sound": "default",
					"click_action": "fcm.ACTION.HELLO"
				}
			};

			await fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!");
				} else {
					console.log("Successfully sent with response: ", response);
				}
				cb();
			});
		}

		function setPromiseSendNoti(userToken) {
			return new Promise(function (resolve) {
				return _send(resolve, userToken);
			});
		}
		async function sendNotification() {
			try {
				for (var floor in resData) {
					if (resData.hasOwnProperty(floor)) {
						console.log(floor);
						for (var unit in resData[floor]) {
							if (resData[floor].hasOwnProperty(unit)) {
								for (var i = 0; i < resData[floor][unit].length; i++) {
									// 	console.log(unit , typeof resData[floor][unit], resData[floor][unit][0]);
									await setPromiseSendNoti(resData[floor][unit][i]);
									// await console.log(resData[floor][unit][i])
								}
							}
						}
					}
				}
			} catch (err) {
				console.log(err);
			} finally {
				endProcess();
			}
		}

		sendNotification();
	});
})(_firebase2.default, _fcmNode2.default);