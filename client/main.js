///// Update Subscriptions /////

Deps.autorun(function(){
  Meteor.subscribe('directory');
  Meteor.subscribe('posts');
  Meteor.subscribe('userData');
  Meteor.subscribe('onlineUsers');
});

///// Collections /////

Posts = new Meteor.Collection('posts');

OnlineUsers = new Meteor.Collection('onlineUsers');

var current_user = {
  name: 'Guest',
  profileImg: 'anon.jpg'
};

Session.set('historyCutOff', new Date() - (1000*60*60));

///// Template data /////

function zeroFill(number, digits) {
  var zeroFillNumber = number + '';
  while(zeroFillNumber.length < digits) {
    zeroFillNumber = '0' + zeroFillNumber;
  }
  return zeroFillNumber;
}

function formatDate(post) {
  var formattedPost = post, d = post.date,
  h, m, s;
  h = zeroFill(d.getHours(),2);
  m = zeroFill(d.getMinutes(),2);
  s = zeroFill(d.getSeconds(),2);
  formattedPost.date = [
    h,':',m,':',s
  ].join('');
  return formattedPost;
}

Template.chat_window.posts = function () {
  var chatFilter = { date: {$gt: Session.get('historyCutOff')} };
  var sort = {sort: {date: -1}};
  var posts = Posts.find(chatFilter, sort);
  var ret = [];
  posts.forEach(function(post) {
    ret.push(formatDate(post));
  });
  return ret;
};

function getCurrentUser() {
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

Template.login_box.user = function() {
  return getCurrentUser();
};

Template.user_list.users = function() {
  return OnlineUsers.find();
};

///// Event handlers /////

function logOut() {
  var user = Meteor.user();
  OnlineUsers.remove({_id: user._id});
  var callback = function() {   
    console.log('logging out');
  };
  Meteor.logout(callback);
}

function logIn() {
  var callback = function() {
    console.log('logged in');
    var user = Meteor.user(), user_id = user._id;
    delete user._id;
    OnlineUsers.upsert({ _id: user_id}, { $set: user }, function(error){console.log(error)});
  };
  Meteor.loginWithTwitter(null, callback);
}

Template.chat_window.events ({
  'click #log-out': logOut,
  'click #log-in': logIn
});

function insertPost(ev) {
  var user, message, keycode, $textbox;
  keycode = ev.keyCode || ev.which;
  if (keycode === 13) {
    ev.preventDefault();
    $textbox = $(ev.target);
    user = getCurrentUser();
    message = $textbox.val();
    Posts.insert({'user': user, 'message': message, 'date': new Date()});
    $textbox.val('');
  }
}

Template.chat_textbox.events({
  'keydown #add-post': insertPost
});

function hideChatLog() {
  Session.set('historyCutOff', new Date());
}

Template.hide_log.events({
  'click #hide-chat': hideChatLog
});
