
Posts = new Meteor.Collection('posts');

var halfHour = 1000*60*30, oneMinute = 1000*60;

function deleteOldPosts() {
  var cutOffPoint = new Date() - halfHour;
  var sel = { date: {$lt: new Date(cutOffPoint) }};
  Posts.remove(sel);
  Meteor.setTimeout(deleteOldPosts, oneMinute);
}

Meteor.startup(function () {
  deleteOldPosts();
});

Meteor.publish('posts', function () {
  return Posts.find();
});


Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId},
                           {fields: {'services': 1}});
});

