Docs = new Mongo.Collection("docs");


if (Meteor.isClient) {
  // counter starts at 0
  Meteor.subscribe("docs");

  Template.body.helpers({
    docs: function() {
      return Docs.find();
    }
  });

  Template.body.events({
    "submit .doc-starter": function(event) {
      var text = event.target.docname.value;

      console.log('adding doc with name', text);
      Meteor.call("newDoc", text);
      event.target.docname.value = "";
      return false;
    }
  });

  Template.doc.events({
    "input .text-content": function(event) {
      var id = this._id;
      setTimeout(function() {
        var text = event.target.value;
        Meteor.call("updateContent", id, text);
      }, 1);
    },
    "click .delete": function() {
      Meteor.call("deleteDoc", this._id);
    }
  });


  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Meteor.publish("content", function () {
      return Docs.find({});
    });
  });
}

Meteor.methods({

  deleteDoc: function (docId) {
    var doc = Docs.findOne(docId);
    Docs.remove(docId);
  },
  newDoc: function(name) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Docs.insert({
      name: name,
      content: ""
    });
  },
  updateContent: function(contentId, newContent) {
    var contentId = Docs.findOne(contentId);
    Docs.update(contentId, { $set: { content: newContent } });
  }
});