var config = {
  apiKey: "AIzaSyDHCYxT4Ad9L5Yj8EBvlnGWMDoyTnu1p4k",
  authDomain: "unibuilder-239ff.firebaseapp.com",
  databaseURL: "https://unibuilder-239ff.firebaseio.com",
  projectId: "unibuilder-239ff",
  storageBucket: "unibuilder-239ff.appspot.com",
  messagingSenderId: "820435656999"
};
var thirdApp = firebase.initializeApp(config, "Third");
app.controller("users", function($scope, $timeout) {

  $scope.gridData = [];
  $scope.gridAccessData = [];
  $scope.gridScheduleAccessData = [];

  $scope.ds = new kendo.data.DataSource({
    data:$scope.gridData,
    pageSize:50
  });
  $scope.dsAccess = new kendo.data.DataSource({
    data:$scope.gridAccessData,
    pageSize:50
  });
  $scope.dsScheduleAccess = new kendo.data.DataSource({
    data:$scope.gridScheduleAccessData,
    pageSize:50
  });

  $scope.getCurrentUID = function() {
    return firebase.auth().currentUser.uid;
  }
  var onChange = function(args) {
    var model = this.dataItem(this.select());
    var key = model.UserKey;
    var ref =  firebase.database().ref('/users/' + key);
    ref.once('value').then(function(snapshot) {
      $scope.user_key = snapshot.key;
      $scope.user_email = snapshot.val().email != undefined? snapshot.val().email : null;
      $scope.user_fname = snapshot.val().firstname!= undefined? snapshot.val().firstname : null;
      $scope.user_lname = snapshot.val().lastname!= undefined? snapshot.val().lastname : null;
      $scope.user_type = snapshot.val().type!= undefined? snapshot.val().type : null;
      $scope.caccess = snapshot.val().createaccess;
      $scope.$apply();
    });

    $("#useraccess").modal('show');
    $scope.viewAccessMode(key);
  }

  $scope.gridOptions = {
    selectable: true,
    change: onChange,
    columns: [
        {field:"UserKey", hidden:true},
        {field:"Email",encoded: false},
        {field:"Firstname", title:"First Name", encoded: false},
        {field:"Lastname", title:"Last Name"},
        {field:"Type"},
        {field:"Other", title:" ", encoded: false}
    ],
    pageable: {
        pageSizes: [20, 50, 75, 100, 250],
        refresh: true,
        buttonCount: 5
    },
    sortable: true,
    resizable: true
  }

  $scope.viewAccessMode = function(key) {
    var jobsRef = firebase.database().ref('/joblist/');
    $scope.vaccess = [];
    $scope.eaccess = [];
    $scope.daccess = [];
    $scope.cscheaccess = [];
    $scope.vscheaccess = [];
    $scope.escheaccess = [];
    $scope.dscheaccess = [];

    jobsRef.on('value', function(data) {
      $scope.gridAccessData = [];
      $scope.gridScheduleAccessData = [];
      $scope.vaccess = [];
      $scope.eaccess = [];
      $scope.daccess = [];
      $scope.cscheaccess = [];
      $scope.vscheaccess = [];
      $scope.escheaccess = [];
      $scope.dscheaccess = [];
      var keys = [];
      for(var k in data.val()) {
        keys.push(k);
      }
      var cnt = 0;

      var col = {
          UserKey: "",
          JobKey: "",
          JobName: "",
          Type: "type",
          ViewAccess: "<input type='checkbox' ng-change='selectAllViewAccess()' ng-model='vaccess[" + cnt + "]'/>",
          EditAccess: "<input type='checkbox' ng-change='selectAllEditAccess()' ng-model='eaccess[" + cnt + "]'/>",
          DeleteAccess: "<input type='checkbox' ng-change='selectAllDeleteAccess()' ng-model='daccess[" + cnt + "]'/>",
      }
      $scope.vaccess.push(false);
      $scope.eaccess.push(false);
      $scope.daccess.push(false);

      var schecol = {
          UserKey: "",
          JobKey: "",
          JobName: "",
          Type: "type",
          CreateAccess: "<input type='checkbox' ng-change='selectAllCreateScheduleAccess()' ng-model='cscheaccess[" + cnt + "]'/>",
          ViewAccess: "<input type='checkbox' ng-change='selectAllViewScheduleAccess()' ng-model='vscheaccess[" + cnt + "]'/>",
          EditAccess: "<input type='checkbox' ng-change='selectAllEditScheduleAccess()' ng-model='escheaccess[" + cnt + "]'/>",
          DeleteAccess: "<input type='checkbox' ng-change='selectAllDeleteScheduleAccess()' ng-model='dscheaccess[" + cnt + "]'/>",
      }
      $scope.cscheaccess.push(false);
      $scope.vscheaccess.push(false);
      $scope.escheaccess.push(false);
      $scope.dscheaccess.push(false);

      cnt ++;
      $scope.gridAccessData.push(col);
      $scope.gridScheduleAccessData.push(schecol);
      for(var i=0; i<keys.length; i++) {  //loop total jobs
        var ref =  firebase.database().ref('/joblist/' + keys[i]);
        ref.once('value').then(function(snapshot) {
          var jobID = snapshot.key;
          var creatorID = snapshot.val().creatorID;
          firebase.database().ref('/jobs/' + jobID + '/' + creatorID).once('value').then(function(snapshot) {
            var col = {
                UserKey: key,
                JobKey: jobID,
                JobName: snapshot.val().jobname,
                Type: "type",
                ViewAccess: "<input type='checkbox' ng-model='vaccess[" + cnt + "]' />",
                EditAccess: "<input type='checkbox' ng-model='eaccess[" + cnt + "]' />",
                DeleteAccess: "<input type='checkbox' ng-model='daccess[" + cnt + "]' />",
            }
            var schecol = {
                UserKey: key,
                JobKey: jobID,
                JobName: snapshot.val().jobname,
                Type: "type",
                CreateAccess: "<input type='checkbox' ng-model='cscheaccess[" + cnt + "]' />",
                ViewAccess: "<input type='checkbox' ng-model='vscheaccess[" + cnt + "]' />",
                EditAccess: "<input type='checkbox' ng-model='escheaccess[" + cnt + "]' />",
                DeleteAccess: "<input type='checkbox' ng-model='dscheaccess[" + cnt + "]' />",
            }
            firebase.database().ref('/jobs/' + jobID + '/' + key).once('value').then(function(snapshot) {
              var acc;
              if(snapshot.val() == undefined) acc = "----";
              else acc = snapshot.val().access != undefined ? snapshot.val().access : "----";
              if(acc.charAt(1) == 'e')
                $scope.eaccess.push(true);
              else if(acc.charAt(1) == '-')
                $scope.eaccess.push(false);
              if(acc.charAt(2) == 'v')
                $scope.vaccess.push(true);
              else if(acc.charAt(2) == '-')
                $scope.vaccess.push(false);
              if(acc.charAt(3) == 'd')
                $scope.daccess.push(true);
              else if(acc.charAt(3) == '-')
                $scope.daccess.push(false);

              $scope.gridAccessData.push(col);
              $scope.dsAccess = new kendo.data.DataSource({
                data:$scope.gridAccessData,
                pageSize:50
              });

              if(snapshot.val() == undefined) acc = "----";
              else acc = snapshot.val().scheaccess != undefined ? snapshot.val().scheaccess : "----";
              if(acc.charAt(0) == 'c')
                $scope.cscheaccess.push(true);
              else if(acc.charAt(0) == '-')
                $scope.cscheaccess.push(false);
              if(acc.charAt(1) == 'v')
                $scope.vscheaccess.push(true);
              else if(acc.charAt(1) == '-')
                $scope.vscheaccess.push(false);
              if(acc.charAt(2) == 'e')
                $scope.escheaccess.push(true);
              else if(acc.charAt(2) == '-')
                $scope.escheaccess.push(false);
              if(acc.charAt(3) == 'd')
                $scope.dscheaccess.push(true);
              else if(acc.charAt(3) == '-')
                $scope.dscheaccess.push(false);

              $scope.gridScheduleAccessData.push(schecol);
              $scope.dsScheduleAccess = new kendo.data.DataSource({
                data:$scope.gridScheduleAccessData,
                pageSize:50
              });

              $scope.$apply();
            });
            cnt ++;

          });

        });
      }
    });
  }

  $scope.selectAllViewAccess = function() {
    for(var i=1; i<$scope.vaccess.length; i++) {
      $scope.vaccess[i] = $scope.vaccess[0];
    }
  }
  $scope.selectAllEditAccess = function() {
    for(var i=1; i<$scope.eaccess.length; i++) {
      $scope.eaccess[i] = $scope.eaccess[0];
    }
  }
  $scope.selectAllDeleteAccess = function() {
    for(var i=1; i<$scope.daccess.length; i++) {
      $scope.daccess[i] = $scope.daccess[0];
    }
  }

  $scope.selectAllCreateScheduleAccess = function() {
    for(var i=1; i<$scope.cscheaccess.length; i++) {
      $scope.cscheaccess[i] = $scope.cscheaccess[0];
    }
  }
  $scope.selectAllViewScheduleAccess = function() {
    for(var i=1; i<$scope.vscheaccess.length; i++) {
      $scope.vscheaccess[i] = $scope.vscheaccess[0];
    }
  }
  $scope.selectAllEditScheduleAccess = function() {
    for(var i=1; i<$scope.escheaccess.length; i++) {
      $scope.escheaccess[i] = $scope.escheaccess[0];
    }
  }
  $scope.selectAllDeleteScheduleAccess = function() {
    for(var i=1; i<$scope.dscheaccess.length; i++) {
      $scope.dscheaccess[i] = $scope.dscheaccess[0];
    }
  }

  var replaceAt = function(str, index, replacement) {
    return str.substr(0, index) + replacement+ str.substr(index + replacement.length);
  }
  $scope.onCheckEditAccess = function($index, UserKey, JobKey) {
    var ref =  firebase.database().ref('/jobs/' + JobKey + '/' + UserKey);
    ref.once('value').then(function(snapshot) {
      var access ;
      if(snapshot.val() == undefined) {
        access = "----";
        ref.set({access: access});
        firebase.database().ref('/user-jobs/' + UserKey + '/' + JobKey).set({access : access});
      }else {
        access = snapshot.val().access != undefined ? snapshot.val().access : "----";
      }

      if($scope.eaccess[$index])
        access = replaceAt(access, 1, 'e');
      else access = replaceAt(access, 1, '-');

      ref.update({access : access});
      firebase.database().ref('/user-jobs/' + UserKey + '/' + JobKey).update({access : access});
    });
  }

  $scope.onCheckViewAccess = function($index, UserKey, JobKey) {
    var ref =  firebase.database().ref('/jobs/' + JobKey + '/' + UserKey);
    ref.once('value').then(function(snapshot) {
      var access ;
      if(snapshot.val() == undefined) {
        access = "----";
        ref.set({access: access});
        firebase.database().ref('/user-jobs/' + UserKey + '/' + JobKey).set({access : access});
      }else {
        access = snapshot.val().access != undefined ? snapshot.val().access : "----";
      }

      if($scope.vaccess[$index])
        access = replaceAt(access, 2, 'v');
      else access = replaceAt(access, 2, '-');
      ref.update({access : access});
      firebase.database().ref('/user-jobs/' + UserKey + '/' + JobKey).update({access : access});
    });
  }

  $scope.onCheckDeleteAccess = function($index, UserKey, JobKey) {
    var ref =  firebase.database().ref('/jobs/' + JobKey + '/' + UserKey);
    ref.once('value').then(function(snapshot) {
      var access ;
      if(snapshot.val() == undefined) {
        access = "----";
        ref.set({access: access});
        firebase.database().ref('/user-jobs/' + UserKey + '/' + JobKey).set({access : access});
      }else {
        access = snapshot.val().access != undefined ? snapshot.val().access : "----";
      }

      if($scope.daccess[$index])
        access = replaceAt(access, 3, 'd');
      else access = replaceAt(access, 3, '-');

      ref.update({access : access});
      firebase.database().ref('/user-jobs/' + UserKey + '/' + JobKey).update({access : access});
    });
  }

  $scope.onCheckAccess = function($index, UserKey, JobKey) {
    var ref =  firebase.database().ref('/jobs/' + JobKey + '/' + UserKey);
    ref.once('value').then(function(snapshot) {
      var access ;
      if(snapshot.val() == undefined) {
        access = "----";
        ref.set({access: access});
        firebase.database().ref('/user-jobs/' + UserKey + '/' + JobKey).set({access : access});
      }else {
        access = snapshot.val().access != undefined ? snapshot.val().access : "----";
      }

      if($scope.vaccess[$index])
        access = replaceAt(access, 2, 'v');
      else access = replaceAt(access, 2, '-');
      if($scope.eaccess[$index])
        access = replaceAt(access, 1, 'e');
      else access = replaceAt(access, 1, '-');
      if($scope.daccess[$index])
        access = replaceAt(access, 3, 'd');
      else access = replaceAt(access, 3, '-');

      ref.update({access : access});
      firebase.database().ref('/user-jobs/' + UserKey + '/' + JobKey).update({access : access});
    });
  }

  $scope.onCheckScheduleAccess = function($index, UserKey, JobKey) {
    var ref =  firebase.database().ref('/jobs/' + JobKey + '/' + UserKey);
    ref.once('value').then(function(snapshot) {
      var access ;
      if(snapshot.val() == undefined) {
        access = "----";
        ref.set({scheaccess: access});
        firebase.database().ref('/user-jobs/' + UserKey + '/' + JobKey).set({scheaccess : access});
      }else {
        access = snapshot.val().scheaccess != undefined ? snapshot.val().scheaccess : "----";
      }

      if($scope.cscheaccess[$index])
        access = replaceAt(access, 0, 'c');
      else access = replaceAt(access, 0, '-');
      if($scope.vscheaccess[$index])
        access = replaceAt(access, 1, 'v');
      else access = replaceAt(access, 1, '-');
      if($scope.escheaccess[$index])
        access = replaceAt(access, 2, 'e');
      else access = replaceAt(access, 2, '-');
      if($scope.dscheaccess[$index])
        access = replaceAt(access, 3, 'd');
      else access = replaceAt(access, 3, '-');

      ref.update({scheaccess : access});
      firebase.database().ref('/user-jobs/' + UserKey + '/' + JobKey).update({scheaccess : access});
    });
  }

  $scope.gridAccessOptions = {
    columns: [
      {field:"UserKey", hidden:true},
      {field:"JobKey", hidden:true},
      {field:"JobName", title:"Job Name"},
      {field:"ViewAccess", title:"View Access", encoded: false},
      {field:"EditAccess", title:"Edit Access", encoded: false},
      {field:"DeleteAccess", title:"Delete Access", encoded: false}
    ],
    pageable: {
        pageSizes: [20, 50, 75, 100, 250],
        refresh: true,
        buttonCount: 5
    },
    sortable: true,
    resizable: true
  }
  $scope.gridScheduleAccessOptions = {
    columns: [
      {field:"UserKey", hidden:true},
      {field:"JobKey", hidden:true},
      {field:"JobName", title:"Job Name"},
      {field:"CreateAccess", title:"Create Access", encoded: false},
      {field:"ViewAccess", title:"View Access", encoded: false},
      {field:"EditAccess", title:"Edit Access", encoded: false},
      {field:"DeleteAccess", title:"Delete Access", encoded: false}
    ],
    pageable: {
        pageSizes: [20, 50, 75, 100, 250],
        refresh: true,
        buttonCount: 5
    },
    sortable: true,
    resizable: true
  }
  $scope.userc_type = "admin";

  var usersRef = firebase.database().ref('/users/');

  usersRef.on('value', function(data) {
    $scope.gridData = [];
    var keys = [];
    for(var k in data.val()) {
      keys.push(k);
    }
    var cnt = 0;
    for(var i=0; i<keys.length; i++) {
      var ref =  firebase.database().ref('/users/' + keys[i]);
      ref.once('value').then(function(snapshot) {
        var key = snapshot.key;
        var email = snapshot.val().email;
        var fname = snapshot.val().firstname;
        var lname = snapshot.val().lastname;
        var type;
        switch(snapshot.val().type) {
          case "admin":
            type = "Admin";
            break;
          case "owner":
            type = "Owner";
            break;
          case "internal":
            type = "Internal User";
            break;
          case "subs":
            type = "Subs/Vendors";
            break;
        }

        var col = {
            UserKey: key,
            Email: email,
            Firstname: fname,
            Lastname: lname,
            Type: type,
            Other: "<a type='button' class='btn btn-sm btn-circle red btn-outline' ng-click='delete(\"" + key + "\");'>Delete</a>"
        }

        $scope.gridData.push(col);
        $scope.ds = new kendo.data.DataSource({
          data:$scope.gridData,
          pageSize:50
        });

        $scope.$apply();
        cnt ++;
      });
    }
  });

  $scope.onCreate = function() {
    var email = $scope.userc_email;
    var fname = $scope.userc_fname;
    var lname = $scope.userc_lname;
    var pw = $scope.userc_password;
    var confpw = $scope.userc_confpw;
    var type = $scope.userc_type;

    if (email == undefined) {
      alert('Please enter an email address.');
      return;
    }

    if(pw != confpw) {
        alert('Confirm password again.');
        return;
    }

    if (pw == undefined) {
      alert('Please enter a password.');
      return;
    }
    thirdApp.auth().createUserWithEmailAndPassword(email, pw).then(function(result) {
        console.log(result);
        var acc;
        switch(type) {
          case "admin":
            acc = true;
            break;
          case "owner":
            acc = false;
            break;
          case "internal":
            acc = false;
            break;
          case "subs":
            acc = false;
            break;
        }
        firebase.database().ref('users/' + result.uid).set({
          email: email,
          firstname: fname,
          lastname: lname,
          type: type,
          createaccess: acc
        });
       $("#createuser").modal('hide')
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if(errorCode == 'auth/invalid-email') {
        alert(email + ' is not a valid email address.')
      } else if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else alert(errorMessage);
      console.log(error);
    });
  }

  $scope.edit = function(key) {
    var ref =  firebase.database().ref('/users/' + key);
    ref.once('value').then(function(snapshot) {
      $scope.user_key = snapshot.key;
      $scope.user_email = snapshot.val().email != undefined? snapshot.val().email : null;
      $scope.user_fname = snapshot.val().firstname!= undefined? snapshot.val().firstname : null;
      $scope.user_lname = snapshot.val().lastname!= undefined? snapshot.val().lastname : null;
      $scope.user_type = snapshot.val().type!= undefined? snapshot.val().type : null;
      $scope.$apply();
    });
  }

  $scope.onSave = function() {
    var key = $scope.user_key;
    var fname = $scope.user_fname;
    var lname = $scope.user_lname;
    var type = $scope.user_type;
    var caccess = $scope.caccess;
    var ref =  firebase.database().ref('/users/' + key);
    ref.update({firstname : fname, lastname : lname, type: type, createaccess: caccess});

    for(var i=1; i<$scope.gridAccessData.length; i++) {
/*      $scope.onCheckViewAccess(i, $scope.gridAccessData[i].UserKey, $scope.gridAccessData[i].JobKey);
      $scope.onCheckEditAccess(i, $scope.gridAccessData[i].UserKey, $scope.gridAccessData[i].JobKey);
      $scope.onCheckDeleteAccess(i, $scope.gridAccessData[i].UserKey, $scope.gridAccessData[i].JobKey);
*/
      $scope.onCheckAccess(i, $scope.gridAccessData[i].UserKey, $scope.gridAccessData[i].JobKey);
    }
    for(var i=1; i<$scope.gridScheduleAccessData.length; i++) {
      $scope.onCheckScheduleAccess(i, $scope.gridScheduleAccessData[i].UserKey, $scope.gridScheduleAccessData[i].JobKey);
    }
  }

  $scope.delete = function(key) {
    bootbox.confirm("Are you sure to delete this user?", function(result) {
      if(result == true) {
        var ref = firebase.database().ref('/users/' + key);
        ref.remove();
      }
    });
  }

});
