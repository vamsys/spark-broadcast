var CiscoSpark = require('ciscospark');
var spark = CiscoSpark.init({
  credentials: {
    authorization: {
      access_token: process.env.access_token
    }
  }
});

var SparkUtils = function() {};

SparkUtils.prototype.isSpaceLocked = function(message) {
	return new Promise(function (fulfill, reject) {
		spark.rooms.get(message.channel).then(function(roomInfo) {
			fulfill(roomInfo.isLocked);
		}).catch(function(e) {
			reject(e);
		});
	});
}


SparkUtils.prototype.isMessageFromModerator = function(message) {
	return new Promise(function (fulfill, reject) {
        console.log(message.channel);
        console.log(message.user);
		spark.memberships.list({roomId: message.channel, personEmail: message.user}).then(function(membershipInfo) {
            console.log(membershipInfo.items);
			var response = false;
			if (membershipInfo && (membershipInfo.items.length == 1))
                response = membershipInfo.items[0].isModerator;
			fulfill(response);
		}).catch(function(e) {
            console.log(e);
			reject(e);
		});
	});
}

SparkUtils.prototype.isUserActive = function(user) {
	return new Promise(function (fulfill, reject) {
	spark.people.list({email: user}).then(function (userInfo) {
		var response = '';
		if(userInfo.items[0].status === "active" && (userInfo.items.length === 1))
			response = userInfo.items[0].status;
		fulfill(response);
	}).catch(function (error) {
		console.log(error);
		reject(error);
	});

	});
}

SparkUtils.prototype.deleleMessage = function(messageId) {
	return new Promise(function (fulfill, reject) {
		spark.messages.remove(messageId).then(function(resp) {
			if (resp != undefined) console.log("Could not delete messages: " + messageId + " : " + resp);
			fulfill();
		});
	});
}

module.exports = new SparkUtils();