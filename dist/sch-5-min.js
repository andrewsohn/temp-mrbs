'use strict';

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _FirebaseClient = require('./FirebaseClient');

var _FirebaseClient2 = _interopRequireDefault(_FirebaseClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;(function (DB, FirebaseClient, async) {
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

			// for(let i=0; i<result.key.length; i++){
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

	// let sendNotification = function(userToken, floorNum, unitNum, hour){


	// 		let body = {
	// 	            "data":{
	// 	                "title": floorNum + unitNum + config.message.title,
	// 	                "body": floorNum + unitNum + config.message.content,
	// 	                "sound": "default",
	// 	                "click_action": "fcm.ACTION.HELLO",
	// 	                "remote": true
	// 	            },
	// 	            "priority": "normal"
	// 	      };

	// 		body["to"] = userToken;
	// 		body = JSON.stringify(body);

	// 		console.log("send noti body -> ", body);

	// 		// Set the headers
	// 		let headers = {
	// 			"Content-Type": "application/json",
	// 			"Content-Length": parseInt(body.length),
	// 			"Authorization": "key=" + config.notiConfig.SERVER_KEY
	// 		}

	// 		// Configure the request
	// 		let options = {
	// 		    url: config.notiConfig.API_URL,
	// 		    method: 'POST',
	// 		    headers: headers,
	// 		    form: body
	// 		}
	// 		// console.log(options)
	// 		// Start the request
	// 		request(options, function (error, response, body) {

	// 		// console.log(error, response.statusCode, response)
	// 		    if (!error && response.statusCode == 200) {
	// 		        // Print out the response body
	// 		        console.log(body)
	// 		    }
	// 		})


	// };

	var endProcess = function endProcess() {
		// Node Shut Down
		process.exit();
	};

	async.waterfall([function (cb) {
		// initializing Firebase DB

		DB.initializeApp(config.dbConfig);
		cb(null, DB);
	}, function (DB, cb) {
		// get instances from Firebase DB

		var database = DB.database().ref();

		database.child("NotificationGroup/").once('value', function (notiData) {

			var notifications = notiData.val();

			database.child("UserData/").once('value', function (usersData) {
				var users = usersData.val();

				// let arrUserToken = [];

				console.log("notice: ", notifications);
				// if("undefined" !== typeof notiData.val()[curDate]){

				console.log("today: ", curDate);
				cb(null, notifications);

				// }

				// _.each(notices[curDate],function(rowDateData,rowDateKey, rowDateList){

				// 	let alphabet = config.unitRange.split("");

				// 	_.each(alphabet, function(letter) {

				// 		if("undefined" !== typeof rowDateData[letter]){

				// 			if("undefined" !== typeof rowDateData[letter][curHour]){

				// 				// if("undefined" == typeof res[rowDateKey][letter][curHour]) res[rowDateKey][letter][curHour] = rowDateData[letter][curHour];


				// 				// Members
				// 				if("undefined" !== typeof rowDateData[letter][curHour].users.members){
				// 					_.each(rowDateData[letter][curHour].users.members, function(userId, i){
				// 						if("undefined" !== typeof users[userId].userPushToken){
				// 							arrUserToken.push(users[userId].userPushToken);
				// 						}
				// 					});
				// 				} 

				// 				// Owner
				// 				if("undefined" !== typeof users[userId].userPushToken){
				// 					let ownerUserId = rowDateData[letter][curHour].users.owner;
				// 					arrUserToken.push(users[ownerUserId].userPushToken);
				// 				}


				// 				console.log(arrUserToken)


				// 				cb(null, arrUserToken);
				// 				// sendNotification(arrUserId, rowDateKey, letter, curHour);;
				// 				// console.log(rowDateKey, "<-");
				// 				// console.log(rowDateData[letter][curHour]);


				// 			}


				// 		}

				// 	});

				// });

			});
		});
	}], function (err, result) {
		console.log(result);
		endProcess();
	});
})(_firebase2.default, _FirebaseClient2.default, _async2.default);