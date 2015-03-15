define([
	'jquery',
	'underscore',
	'backbone',
	'bootstrapjs',
	'LocaleChatMessageModel',
	'LocaleChatUserModel',
	'LocaleAuth'
], function($, _, Backbone, Bootstrap, LocaleChatMessageModel, LocaleChatUserModel, LocaleAuth){

	var Weekdays = new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");

	var FormatTimestamp = function(timestamp) {
		var date = new Date(timestamp);

		var day = Weekdays[date.getDay()];
		var hours = "0" + date.getHours();
		var minutes = "0" + date.getMinutes();
		var seconds = "0" + date.getSeconds();

		var format = day + ", " + hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);
		
		return format;
	};

	var LocaleChatWindowView = Backbone.View.extend({
		tagName: 'div',

		className: 'chatbox',

		events: {
			'click .chatbox-minimize' : 'minimize',
			'click .chatbox-exit' : 'exit',
			'click .chatbox-header' : 'maximize'

		},

		initialize: function(options) {
			this.parent = options.parent;
			this.ChatUserModel = options.UserModel;
			this.$el.html(""); // Remove dummy data
			this.listenTo(this.collection, "add", this.add);
			this.listenTo(this.collection, "change", this.render);
		},

		render: function() {
			var chatStr = "<div class='chatbox-header'><div class='chatbox-icon'></div><div class='chatbox-title'><div class='h1'>" + this.ChatUserModel.get("name") + "</div>" +
"<div class='h2'>University of British Columbia</div> </div><div class=\"chatbox-controls\"><div class=\"chatbox-exit btn\" href='#'><i class=\"fa fa-close\"></i></div>" +
"<div class=\"chatbox-minimize btn\" href='#'><i class=\"fa fa-minus\"></i></div></div></div><div class='chatbox-content'>" +
"<div class='chatbox-messages'><div class=\"messages-wrapper\"></div> </div><div class='chatbox-input input-group'><input type=\"text\" class=\"form-control message-box\" placeholder=\"Enter Message\">" +
"<span class=\"input-group-btn\"><button class=\"btn btn-default\" type=\"button\"><i class='fa fa-paper-plane'></i></button>";
"</span></div></div>";

			this.$el.html(chatStr);

			return this;
		},

		renderAllMessages: function() {
			this.$el.find(".messages-wrapper").html("");

			_.each(this.collection.models, function(model) {
				this.$el.find(".messages-wrapper").append( this.renderMessage( model ));
			}, this);
		},

		renderMessage: function(message) {
			var UserSent = false;
			//if(message.get("firstName") === LocaleAuth.GetUserModel.get("firstName") && message.get("lastInitial") === LocaleAuth.GetUserModel.get("lastName")[0])
			//	UserSent = true;

			var msgStr = UserSent === true ? "<div class=\"chat-message local-message\">" : "<div class=\"chat-message foreign-message\">";
            msgStr += "<div class=\"profilepic chatpic img-circle\"></div><div class='message-content-wrapper'><div class='message-content' ><p>" +
                        message.get("message") + "</p><span class=\"message-subtext\">" + message.get("firstName") + " " + message.get("lastInitial") + " - " +
                        FormatTimestamp(message.get("timestamp")) + "</span></div></div></div>";

            return msgStr;
		},

		add: function(message) {
			this.$el.find(".messages-wrapper").append( this.renderMessage(message) );
		},

		remove: function(message) {

		},

		minimize: function(){
			var checkState = this.$el.css("bottom");
			if (checkState == "42px"){
				this.$el.children(".chatbox-content").css({display: "block"});
				this.$el.stop().animate({"bottom" :"384px"}, 400);
			} else {
				this.$el.stop().animate({"bottom" :"42px"}, 400, function(){
					this.$el.children(".chatbox-content").css({display: "none"});
				});
			}
		},

		maximize: function(){
			console.log("MAX");
			var checkState = this.$el.css("bottom");
			if (checkState == "42px"){
				this.$el.children(".chatbox-content").css({display: "block"});
				console.log("RUN");
				this.$el.stop().animate({"bottom" :"384px"}, 400);
			}
		},

		exit: function(){
			this.$el.closest(".chatbox").remove();
			this.parent.model.set("joined", false);
		}
	});

	return LocaleChatWindowView;
});