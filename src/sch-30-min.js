var firebase = require('firebase');
var _ = require('underscore');
var async = require('async');
// var querystring = require('querystring');
// var http = require('http');
// var fetch = require('node-fetch');
// var FormData = require('form-data');
var request = require('request');

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

var body = {
		            "data":{
		                "title": config.message.title,
		                "body": config.message.content,
		                "sound": "default",
		                "click_action": "fcm.ACTION.HELLO",
		                "remote": true
		            },
		            "priority": "normal"
		      };

			body["to"] = "eQlGBSZc_lM:APA91bG-_hgSFQ5DOWAUPHMDiKjVOpbdL4CD0gBqhvT6CeBvlZ3bs6T1BSDsekgIiSz-QEOU5nGw2ks_A1tozDzHHPhHBRiwd22fFggqPmiVr9wvBNAzzvXASFYoFpusLbaI8FHWypXo";
			body = JSON.stringify(body);
console.log(config.notiConfig.SERVER_KEY)
// var form = new FormData({
// 	headers: {
// 		"Content-Type": "application/json",
// 		"Content-Length": parseInt(body.length),
// 		"Authorization": "key=" + config.notiConfig.SERVER_KEY
// 	}
// });

			// var headers = new Headers({
   //          "Content-Type": "application/json",
			// 	"Content-Length": parseInt(body.length),
			// 	"Authorization": "key=" + config.notiConfig.SERVER_KEY
   //      });
			
			// var headers = {
			// 	"Content-Type": "application/json",
			// 	"Content-Length": parseInt(body.length),
			// 	"Authorization": "key=" + config.notiConfig.SERVER_KEY
			// };
// "Content-Length": parseInt(body.length),
// console.log("send notification! -> ",arrToken, floorNum, unitNum, hour);
console.log(config.notiConfig.API_URL)
			



			// fetch(config.notiConfig.API_URL, { method: "POST", headers: form.getHeaders(), body:body })
			// .then(function(response){
			// 	console.log("Send " + "data" + " response", response);
			// })
			// .catch(function(error){
			// 	console.log("Error sending " + "data", error);
			// });


// var http = new XMLHttpRequest();
// var url = config.notiConfig.API_URL;

// http.open("POST", url, true);

// //Send the proper header information along with the request
// http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// http.setRequestHeader("Content-Length", parseInt(body.length));
// http.setRequestHeader("Authorization", "key=" + config.notiConfig.SERVER_KEY);


// http.onreadystatechange = function() {//Call a function when the state changes.
//     if(http.readyState == 4 && http.status == 200) {
//         console.log(http.responseText);
//     }
// }
// http.send(body);




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