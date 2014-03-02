Posts = new Meteor.Collection('posts');

console.log('hi');

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
    consumerKey: "a4lwkZVZMzRvAcFI5C0KA",
    secret: "zN3O0NV4ii3XghybLjhLjylrmvVP0bneCkmYk0JcMLQ"
  });
});

Meteor.publish('posts', function () {
  return Posts.find();
});


Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId},
                           {fields: {'services': 1}});
});

