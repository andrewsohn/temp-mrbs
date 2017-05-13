var Firebase = require('firebase');
var _ = require('underscore');
var async = require('async');
// var querystring = require('querystring');
// var http = require('http');
// var fetch = require('node-fetch');
var request = require('request');

;(function(DB){
	'use strict';

	// get Today Date Format YYYYMMDD
	var todayDate = new Date();
	var mm = todayDate.getMonth() + 1; // getMonth() is zero-based
	var dd = todayDate.getDate();
	var curDate = [todayDate.getFullYear(), (mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0') + dd].join('');

	// get Current Hour
	var trgDate = new Date(todayDate.getTime() + 60*60*1000);
	var curHour = Math.ceil(trgDate.getHours());

	curHour = 16;
		         
	var config = {
		"unitRange": "ABCD",
		"message": {
			"title":"회의실 5분 알람",
			"content":"회의실에서 회의 미팅이 5분 뒤에 진행됩니다."
		},
		"dbConfig" : {
			"apiKey" : "AIzaSyDEw1aAAlX3QjD_zXJewFeuPao799TwZd0",
			"authDomain" : "bookmeetingroom-150ca.firebaseapp.com",
			"databaseURL" : "https://bookmeetingroom-150ca.firebaseio.com",
			"storageBucket" : "bookmeetingroom-150ca.appspot.com",
			"messagingSenderId" : "765500703433"
		},
		"notiConfig" : {
			"SERVER_KEY" : 'AIzaSyA7eao_wnLiS-hdU9r7-KQuPcpq7tPJYXs',
			"API_URL" : "https://fcm.googleapis.com/fcm/send",
			"API_PATH" : "/fcm/send"
		}
	}; 

	var initializeDatabase = function(cb){
		DB.initializeApp(config.dbConfig);
		cb(null, DB);
	};

	var getBookInstances = function(DB, cb){
		DB.database().ref("NotificationGroup/").on('value', function(result){

			// for(var i=0; i<result.key.length; i++){
			// 	console.log(result.key[i].);
			// }
			var rootData = result.val();
			if("undefined" !== typeof rootData[curDate]){
				console.log("today: ", curDate);

				_.each(rootData[curDate],function(rowDateData,rowDateNum){

					var alphabet = config.unitRange.split("");

					_.each(alphabet, function(letter) {

						if("undefined" !== typeof rowDateData[letter]){

							console.log("current hour: ", curHour);

							if("undefined" !== typeof rowDateData[letter][curHour]){
								console.log(rowDateData[letter][curHour]);
							}
							
						}

					});

					cb(null, "test");

				});
				
			}
			

			
		});;
	};

	var sendNotification = function(userToken, floorNum, unitNum, hour){
		
			
			var body = {
		            "data":{
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
			}

			// Configure the request
			var options = {
			    url: config.notiConfig.API_URL,
			    method: 'POST',
			    headers: headers,
			    form: body
			}
			// console.log(options)
			// Start the request
			request(options, function (error, response, body) {

			// console.log(error, response.statusCode, response)
			    if (!error && response.statusCode == 200) {
			        // Print out the response body
			        console.log(body)
			    }
			})
		

		
	};

	var endProcess = function(){
		// Node Shut Down
		process.exit();
	};

	async.waterfall([
		function(cb){ // initializing Firebase DB
			DB.initializeApp(config.dbConfig);
			cb(null, DB);
		},
		function(DB, cb){ // get instances from Firebase DB
			// console.log(db)

			var database = DB.database().ref();
			database.child("NotificationGroup/").once('value', function(notiData){
				var notices = notiData.val();
				
				database.child("UserData/").once('value', function(usersData){
					var users = usersData.val();
				

					cb(null, notices);
				});
			});
		}
	], function(err, result){
		console.log(result);
		endProcess();
		
	});
	
})(Firebase);