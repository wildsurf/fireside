Posts = new Meteor.Collection('posts');

console.log('hi');
OnlineUsers = new Meteor.Collection('onlineUsers');

var halfHour = 1000*60*30, oneMinute = 1000*60;

function deleteOldPosts() {
  var cutOffPoint = new Date() - halfHour;
  var sel = { date: {$lt: new Date(cutOffPoint) }};
  Posts.remove(sel);
  Meteor.setTimeout(deleteOldPosts, oneMinute);
}

Meteor.startup(function () {
  deleteOldPosts();

	Accounts.loginServiceConfiguration.remove({
	    service: "twitter"
	  });
	Accounts.loginServiceConfiguration.insert({
	  service: "twitter",
	  consumerKey: "FDkKSDnHCavJnzMPSJKB0Q",
	  secret: "jYcwfIzhJwLxIAaF6BEq4YOq4Ggp7W5q8a8pkVlHSxA"
	});
});

Meteor.publish('posts', function () {
  return Posts.find();
});


Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId},
                           {fields: {'services': 1}});
});

Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {services: 1, profile: 1}});
});

Meteor.publish("onlineUsers", function () {
  return OnlineUsers.find();
});
