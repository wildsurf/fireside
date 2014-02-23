'use strict';

Template.user_details.user = function() {
  var user = {
    name: 'Guest',
    profileImg: 'anon.jpg'
  };
  if (Meteor.user() && Meteor.user().services) {
    if (Meteor.user().services.twitter) {
      user.name = Meteor.user().profile.name;
      user.profileImg = Meteor.user().services.twitter.profile_image_url;
    }
  }
  return user;
};

function logOut() {
  var callback = function() {
    console.log('logged out');
  };
  Meteor.logout(callback);
}

function logIn() {
  var callback = function() {
    console.log('logged in');
  };
  Meteor.loginWithTwitter(null, callback);
}

Template.login_box.events ({
  'click #log-out': logOut,
  'click #log-in': logIn
});
