Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function () {
  this.route('chat_view', {
    path: '/',
    waitOn: function() {
      Meteor.subscribe('directory');
      Meteor.subscribe('posts');
      Meteor.subscribe('userData');
      Meteor.subscribe('onlineUsers');
    }
  });
});
