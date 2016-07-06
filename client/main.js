

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Mongo} from 'meteor/mongo';
import '../imports/api/activityList.js';
import './main.html';


//default session

Session.setDefaultPersistent('userID','');
Session.setDefaultPersistent('userName','');
Session.setDefaultPersistent('userType','');
Session.setDefaultPersistent('profileMade','No');
Session.setDefault('qvselect','');


//default session end



//Router Info

Router.route('/dashboard',{
	template:'dashboard',
	name:'dash'
});

Router.route('/',{

	template:'home',
  name:'home'
});

Router.route('/actcreate',{

  template : "actcreate",
  name:'create'
});

Router.route('/addmodule',{

  template : "addmodule",
  name:'addmodule'
});

Router.route('/studentlist',{

  template : "studentlist",
  name:'studentlist'
});

Router.route('/session',{

  template : "session",
  name:'session'
});



//router info end


//template home events

Template.home.events({
   'click #fourth #Login' : function(){

   console.log("Heya!");
   loginIVLE();
   
   } 
 });




//template home events end



//Independent functions



Template.dashboard.helpers({



   username:function(){
     
     return Session.get('userName');
   },
   

   dashboard: function (){
    var user = Session.get('userID');

    if(user != ''){
   	if(user == 't0914194'){

      Session.setPersistent('userType','teacher');
   		
   	}

   	else{
        Session.setPersistent('userType','student');
   		
   	}
   }
 },

   list : function(){

   	if(Session.get('userType')=='teacher'){

   		return activityList.find({});
   	}
   },

   isteacher: function(){
    if(Session.get('userType')=='teacher'){

      return true;
    }
   },



});


Template.navigation.helpers({
  
   currentTime : function() {

       return Chronos.currentTime().toString().slice(0,24); // updates every second
   },

   getUser : function(){

    return Session.get('userName');
   },

   getID: function(){

    return Session.get('userID');
   },

   getModules : function () {
    
        return teacherModules.find({userID:Session.get('userID')});
   },

   isModule: function(){
   
    if(teacherModules.find({userID:Session.get('userID')}).fetch()==''){

      return false;
    }

    else{
      return true;
    }

   },





});

Template.navigation.events({
   'click #first #out' : function(){

   
   Router.go('/');
   logout();

   },
   
   'click #createModule' : function(){

   
   Router.go('/addmodule');
   

   },



   'click #first #homebtn' : function(){

   if(Session.get('userState') == "logged-out"){
    Router.go('/');
   }
   
   else{
    Router.go('/dashboard');
   }
   

   }  
 });
//


Template.create.events({
  'click #createbtn' : function(){
 
    Router.go('/actcreate');
  },


});




Template.actcreate.helpers({

  setCounter : function(){

   
   Session.setPersistent('counter', []);
   

  },

  count : function (){

    return Session.get('counter');
  }


});

Template.questionlist.helpers({

   


});



Template.actcreate.events({
   'click #addquestion' : function(){
 
    count = Session.get('counter');
    var uniqid =  'count' + (Math.floor(Math.random() * 100000)).toString(); // Give a unique ID so you can pull _this_ input when you click remove
    count.push({uniqid: uniqid, value: ""});
    newcount = count;
    Session.setPersistent('counter',newcount);
  },


'submit #activityform'(event){
  
   count = Session.get('counter');
   event.preventDefault();
   const target = event.target;
  
   var module = target.modulename.value;
   var activity = target.activityname.value;
   var code = target.modulecode.value;
   var append = [];
   var x;

   for(x=0;x<count.length;x++){
     var uid = count[x].uniqid;
     var val = target[uid].value;
     append.push(val);
   }

   activityList.insert({
        aID : code + activity,
        activity:activity,
        name : module,
        module : code,
        status : "inactive",
        time : new Date(),
        userID : Session.get('userID')
    });

   questions.insert({
        aID : code + activity,
        quest : append,
        time : new Date()

  });
   
   Session.setPersistent('counter','');
   alert("Activity has been created!");
   Router.go('/dashboard');
}
});



Template.addquestion.events({

   'click #remove': function(event) { 
    console.log('remove');
    uniqid = this.uniqid;

    count = Session.get('counter');
    newercount = _.filter(count, function(x) { return x.uniqid != uniqid; });
    Session.setPersistent('counter', newercount);
  },


});

Template.addquestion.helpers({

qnumber : function (){

  return Session.get('counter').length;
}

});

Template.addmodule.helpers({

 getModuleList:function(){

  return teacherModules.find({userID:Session.get('userID')});
 }


});

Template.addmodule.events({


  'submit #moduleform'(event){

   event.preventDefault();
   const target = event.target;
   var modname = target.modulename.value;
   var modcode = target.modulecode.value;
   var studentlist = target.studentlist.value;
   var array = studentlist.split('\n');
  
   teacherModules.insert({
        module : modname,
        code : modcode,
        userID : Session.get('userID'),
        studentID : studentlist,
        time : new Date(),
   });
  
   var z;
   for (z=0; z< array.length;z++){
   studentModules.insert({
        studentID : array[z],
        module : modname,
        code : modcode,
        time : new Date(),

   });
   }
  
   alert("Module has been created!");
   Router.go('/dashboard');
  
  
}
});

Template.module.events({

'click .modlist': function(e){

  Session.setPersistent('modID',this._id);
  Router.go('/studentlist');
}

});


Template.studentlist.helpers({

  getStudentList : function (){
   
    var x =  teacherModules.findOne({_id:Session.get('modID')}).studentID;
    var y = x.split('\n');

    

    return y;
    
    
  }

});

Template.actbox.events({

  'click #viewact': function(e){

  Session.setPersistent('aID',this.aID);
  Router.go('/session');
}
});

Template.session.helpers({
 
   qlist : function (){
     
      var a =  questions.findOne({'aID':Session.get('aID')}).quest;    
      Session.setPersistent('qnumber',a.length);
      return a; 
             
   },

   aid : function (){

    return Session.get('aID');
   },

   getactqnum : function(){

   return Session.get('qnumber');

   },

   getactmod : function(){

    return activityList.findOne({'aID':Session.get('aID')}).name;
   },

   getmodcode : function(){

    return activityList.findOne({'aID':Session.get('aID')}).module;
   },

   getactcode : function(){

    return activityList.findOne({'aID':Session.get('aID')}).activity;
   },
  
   getactnum : function (){

    var x = activityList.findOne({'aID':Session.get('aID')}).module;
    return teacherModules.findOne({'code':x}).studentID.split('\n').length;
   },

   qviewmain : function(){

    if(Session.get('qvselect') == ''){

    return 'None Selected';
    
     }

   else{

    return questions.findOne({'aID':Session.get('aID')}).quest[Session.get('qvselect')];
  
   }

   }

});


Template.session.events({

  'click .qbtn' : function(event){

   event.preventDefault();
   const target = event.target;
   var qid = target.id;
   qid = qid.slice(1);
   Session.set('qvselect',qid);
  },

  'submit #addqform' : function(e){

   e.preventDefault();
   const target = event.target;
   var q = target.addition.value;
   var old = questions.findOne({'aID':Session.get('aID')}).quest; 
   var id = questions.findOne({'aID':Session.get('aID')})._id; 
   console.log(old);
   old.push(q);

   questions.update({_id:id }, { $set: {quest: old }});
  },


});

//loginIVLE

function loginIVLE() {
  var APIKey = "6YIDjroMfeBjiTP49ms99";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var returnURL = 'localhost:3000/dashboard';
  var LoginURL = APIDomain + "api/login/?apikey=6YIDjroMfeBjiTP49ms99&url=http%3A%2F%2F" + returnURL;
  Session.setPersistent('userState',"logged-in");

  window.location = LoginURL;

  

}

//function end
var Token = window.location.search.substr(1).split(/\&/)[0].slice(6);
Session.setPersistent("Token",Token);


Populate_UserId();
Populate_UserName();

//userName through IVLE
function Populate_UserName() {  
  var APIKey = "6YIDjroMfeBjiTP49ms99";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var token = Session.get('Token');
  var url = APIUrl + "UserName_Get?output=json&callback=?&APIKey=" + APIKey + "&Token=" + token;
  
  

  if(Session.get('setuserName') == 'No'){
  jQuery.getJSON(url, function (data) {
      Session.setPersistent('userName', data);
      Session.setPersistent('setuserName', 'Yes');
         
     
  });
}
}
//function end

//userID through IVLE

function Populate_UserId() {
  var APIKey = "6YIDjroMfeBjiTP49ms99";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var token = Session.get('Token');
  var url = APIUrl + "UserID_Get?output=json&callback=?&APIKey=" + APIKey + "&Token=" + token;


  if(Session.get('setID') == 'No'){
  jQuery.getJSON(url, function (data) {
      Session.setPersistent('userID', data);
      Session.setPersistent('setID', 'Yes');
        
  });
}



}

//function end




function logout(){

  Session.setPersistent('userState','logged-out');
  Session.setPersistent('userID','');
  Session.setPersistent('userName','');
  Session.setPersistent('userType','');
  Session.setPersistent('UserType','');
  Session.setPersistent('Token','');
  Session.setPersistent('setID', 'No');
  Session.setPersistent('setuserName', 'No');

  
}


//Independent functions end
