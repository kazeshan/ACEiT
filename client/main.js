import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//default session

Session.setDefault('UserType','Student');
Session.setDefault('userName','Arora');


//default session end


//Router Info



Router.route('/student',{
	template:'student',
	name:'sturoute'
});

Router.route('/teacher',{
	template:'teacher',
	name:'tearoute'
});

Router.route('/',{

	template:'home'
});


//router info end


//template home events

Template.home.events({
   'click #studentlink' : function(){

   	Session.setPersistent('UserType','student');
   	console.log(Session.get('UserType'));

    loginIVLE();
   


   },

   'click #teacherlink' : function(){

   	Session.setPersistent('UserType','teacher');
   	console.log(Session.get('UserType'));
   }
 });


//template home events end

//template student helpers

Template.student.helpers({

     username: function(){

     	Populate_UserName();
     	return Session.get('userName');
     },

     userid: function(){
     	Populate_UserId();
     	return Session.get('userID');
     }

});

//template student helpers end

//template teacher helpers

Template.teacher.helpers({

     usertype: function(){
     	return Session.get('UserType');
     }

});


//template teacher helper close

//Independent functions






//loginIVLE

function loginIVLE() {
  var APIKey = "6YIDjroMfeBjiTP49ms99";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var returnURL = 'localhost:3000/student';
 

  var LoginURL = APIDomain + "api/login/?apikey=6YIDjroMfeBjiTP49ms99&url=http%3A%2F%2F" + returnURL;

  window.location = LoginURL;

  
}

//function end

var Token = window.location.search.substr(1).split(/\&/)[0].slice(6);
Session.setPersistent("Token",Token);

//userName through IVLE
function Populate_UserName() {
  
  var APIKey = "6YIDjroMfeBjiTP49ms99";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var token = Session.get('Token');
  var url = APIUrl + "UserName_Get?output=json&callback=?&APIKey=" + APIKey + "&Token=" + token;

  jQuery.getJSON(url, function (data) {
      Session.setPersistent('userName', data);
      console.log(Session.get('userName'));    //document.cookie="userName="+data;
      
  });


}
//function end

//userID through IVLE

function Populate_UserId() {
  var APIKey = "6YIDjroMfeBjiTP49ms99";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var token = Session.get('Token');
  var url = APIUrl + "UserID_Get?output=json&callback=?&APIKey=" + APIKey + "&Token=" + Token;

  jQuery.getJSON(url, function (data) {
      Session.setPersistent('userID', data);
      console.log(Session.get('userID'));    //document.cookie="userId="+data;
      
  });
}

//function end


//Independent functions end
