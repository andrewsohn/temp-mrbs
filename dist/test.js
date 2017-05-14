'use strict';

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

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
			"API_URL": "https://fcm.googleapis.com/fcm/send",
			"API_PATH": "/fcm/send"
		}
	};

	var initializeDatabase = function initializeDatabase(cb) {
		DB.initializeApp(config.dbConfig);
		cb(null, DB);
	};

	var getBookInstances = function getBookInstances(DB, cb) {
		DB.database().ref("NotificationGroup/").on('value', function (result) {

			// for(var i=0; i<result.key.length; i++){
			// 	console.log(result.key[i].);
			// }
			var rootData = result.val();
			if ("undefined" !== typeof rootData[curDate]) {
				console.log("today: ", curDate);

				_underscore2.default.each(rootData[curDate], function (rowDateData, rowDateNum) {

					var alphabet = config.unitRange.split("");

					_underscore2.default.each(alphabet, function (letter) {

						if ("undefined" !== typeof rowDateData[letter]) {

							console.log("current hour: ", curHour);

							if ("undefined" !== typeof rowDateData[letter][curHour]) {
								console.log(rowDateData[letter][curHour]);
							}
						}
					});

					cb(null, "test");
				});
			}
		});;
	};

	var sendNotification = function sendNotification(userToken, floorNum, unitNum, hour) {

		var body = {
			"data": {
				"title": floorNum + unitNum + config.message.title,
				"body": floorNum + unitNum + config.message.content,
				"sound": "default",
				"click_action": "fcm.ACTION.HELLO",
				"remote": true
			},
			"priority": "normal"
		};

		body["to"] = userToken;
		body = JSON.stringify(body);

		console.log("send noti body -> ", body);

		// Set the headers
		var headers = {
			"Content-Type": "application/json",
			"Content-Length": parseInt(body.length),
			"Authorization": "key=" + config.notiConfig.SERVER_KEY
		};

		// Configure the request
		var options = {
			url: config.notiConfig.API_URL,
			method: 'POST',
			headers: headers,
			form: body
		};
		// console.log(options)
		// Start the request
		(0, _request2.default)(options, function (error, response, body) {

			// console.log(error, response.statusCode, response)
			if (!error && response.statusCode == 200) {
				// Print out the response body
				console.log(body);
			}
		});
	};

	var endProcess = function endProcess() {
		// Node Shut Down
		process.exit();
	};

	_async2.default.waterfall([function (cb) {
		// initializing Firebase DB
		DB.initializeApp(config.dbConfig);
		cb(null, DB);
	}, function (DB, cb) {
		// get instances from Firebase DB
		// console.log(db)

		// var database = DB.database().ref();
		// database.child("NotificationGroup/").once('value', function(notiData){
		// 	var notices = notiData.val();

		// 	database.child("UserData/").once('value', function(usersData){
		// 		var users = usersData.val();
		var arr = ['eQlGBSZc_lM:APA91bG-_hgSFQ5DOWAUPHMDiKjVOpbdL4CD0gBqhvT6CeBvlZ3bs6T1BSDsekgIiSz-QEOU5nGw2ks_A1tozDzHHPhHBRiwd22fFggqPmiVr9wvBNAzzvXASFYoFpusLbaI8FHWypXo'];

		var serverKey = 'AIzaSyA7eao_wnLiS-hdU9r7-KQuPcpq7tPJYXs';
		var fcm = new FCM(serverKey);

		var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera) 
			to: 'eQlGBSZc_lM:APA91bG-_hgSFQ5DOWAUPHMDiKjVOpbdL4CD0gBqhvT6CeBvlZ3bs6T1BSDsekgIiSz-QEOU5nGw2ks_A1tozDzHHPhHBRiwd22fFggqPmiVr9wvBNAzzvXASFYoFpusLbaI8FHWypXo',
			collapse_key: 'Meeting Room Alarm',

			"notification": {
				"title": "Simple FCM Client",
				"body": "This is a notification with only NOTIFICATION.",
				"sound": "default",
				"click_action": "fcm.ACTION.HELLO"
			}

		};

		fcm.send(message, function (err, response) {
			if (err) {
				console.log("Something has gone wrong!");
			} else {
				console.log("Successfully sent with response: ", response);
			}
		});

		// FirebaseClient.sendNotificationWithData(arr);
		// 		cb(null, notices);
		// 	});
		// });
	}], function (err, result) {
		console.log(result);
		endProcess();
	});
})(_firebase2.default, _fcmNode2.default);