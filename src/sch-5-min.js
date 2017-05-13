import Firebase from 'firebase';
import _ from 'underscore';
import async from 'async';
import request from 'request';
import FirebaseClient from './FirebaseClient';

;(function(DB, FirebaseClient, async){
	'use strict';

	// get Today Date Format YYYYMMDD
	let todayDate = new Date();
	let mm = todayDate.getMonth() + 1; // getMonth() is zero-based
	let dd = todayDate.getDate();
	let curDate = [todayDate.getFullYear(), (mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0') + dd].join('');

	// get Current Hour
	let trgDate = new Date(todayDate.getTime() + 60*60*1000);
	let curHour = Math.ceil(trgDate.getHours());

	// test value
	curDate = 20170512;
	curHour = 16;
		         
	let config = {
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

	let initializeDatabase = function(cb){
		DB.initializeApp(config.dbConfig);
		cb(null, DB);
	};

	let getBookInstances = function(DB, cb){
		DB.database().ref("NotificationGroup/").on('value', function(result){

			// for(let i=0; i<result.key.length; i++){
			// 	console.log(result.key[i].);
			// }
			let rootData = result.val();
			if("undefined" !== typeof rootData[curDate]){
				console.log("today: ", curDate);

				_.each(rootData[curDate],function(rowDateData,rowDateNum){

					let alphabet = config.unitRange.split("");

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

	let endProcess = function(){
		// Node Shut Down
		process.exit();
	};

	async.waterfall([
		function(cb){ // initializing Firebase DB

			DB.initializeApp(config.dbConfig);
			cb(null, DB);

		},
		function(DB, cb){ // get instances from Firebase DB

			let database = DB.database().ref();
			
			database.child("NotificationGroup/").once('value', function(notiData){

				let notifications = notiData.val();
				
				database.child("UserData/").once('value', function(usersData){
					let users = usersData.val();
				
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
		}
		
	], function(err, result){
		console.log(result);
		endProcess();
		
	});
	
})(Firebase, FirebaseClient, async);