const express = require('express');
const app = express();
const port = 3000;

const request = require('request');

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('main.ejs');
})

var E = 'a';
var P = 'a';
app.get('/signup', (req, res) => {
  res.render('signup');
})
app.get('/signin', (req, res) => {
  res.render('signin');
})
	
app.get('/signupsubmit',(req, res)=>{
  const FullName = req.query.FullName;
  const RollNumber = req.query.RollNumber;
  const Email = req.query.Email;
  const Password = req.query.Password;
  const Confirm = req.query.ConfirmPassword;
  if(Password == Confirm){
    db.collection("users").add({
      Name: FullName,
      RollNumber: RollNumber,
      Email: Email,
      Password: Password,
      Confirm: Confirm,
          sem1: '',
          sem1lab : '',
          sem2: '',
          sem2lab: '',
          sem3: '',
          sem3lab: '',
          sem4: '',
          sem4lab:'',
          sem5: '',
          sem5lab: '',
          sem6: '',
          sem6lab: '',
          sem7: '',
          sem7lab: '',
          sem8: '',
          sem8lab: '',
    })
    .then(()=>{
        res.render("success", {msg: "Registered Succesfully. "});
    });
  }
  else{
    res.send("Registration Failed");
  }
});

app.get('/signinsubmit',(req, res)=>{
    E = req.query.Email;
    P = req.query.Password;
  var usersData = {};
  var flag = false;
  db.collection("users")
    .where("Email", "==", E)
    .where("Password", "==", P)
    .get()
    .then((docs)=>{
      docs.forEach((doc)=>{
        flag = true;
        usersData = doc.data();
      });
      if(flag){
        res.render("dashboard",{data:usersData});
      }
      else{
        res.send("Invalid user");
      }
    });
});

app.get('/feedbacksubmit',(req,res)=>{
  res.render("feedback",{});
})
app.get('/feedbacksubmit1',(req, res)=>{
  console.log("ok")
  var usersData = {};
  db.collection("users").where("Email", "==", E).where("Password", "==", P).get().then((docs)=>{
      console.log(E)
      console.log(P)
      docs.forEach((doc)=>{
        console.log("ok")
        db.collection("users").doc(doc.id).update({
          sem1:req.query.sem1 ,
          sem1lab : req.query.sem1Lab,
          sem2: req.query.sem2,
          sem2lab: req.query.sem2Lab,
          sem3: req.query.sem3,
          sem3lab: req.query.sem3Lab,
          sem4: req.query.sem4,
          sem4lab:req.query.sem4Lab,
          sem5: req.query.sem5,
          sem5lab: req.query.sem5Lab,
          sem6: req.query.sem6,
          sem6lab: req.query.sem6Lab,
          sem7:req.query.sem7,
          sem7lab: req.query.sem7Lab,
          sem8: req.query.sem8,
          sem8lab: req.query.sem8Lab
        });
            res.send("Feedback successfully submitted");
    });
  });
});
app.get('/biosubmit1',(req,res)=>{
  var usersData = {};
  db.collection('users').where("Email", '==' , E).where("Password",'==', P).get().then((docs)=>{
    console.log(E)
    console.log(P)
      docs.forEach((doc)=>{
      db.collection("users").doc(doc.id).update({
        FatherName : req.query.fname,
        MotherName : req.query.mname,
        DOB : req.query.dob,
        Address : req.query.address,
        Pincode : req.query.pincode,
        Gender : req.query.gender,
        Department : req.query.department,
    });
    res.send("Data updated successfully");
  })
});
});


app.get('/coursesubmit', (req, res) => {
      res.render("courseMaterial");
});
app.get('/timetablesubmit', (req, res) => {
  res.render("timetable");
});
app.get('/aboutsubmit', (req, res) => {
  res.render("about");
});
app.get('/biosubmit',function(req,res){
  var usersData = {};
  db.collection('users')
    .where("Email", '==' , req.query.email)
    .where("Password",'==',req.query.pwd)
    .get()
    .then((docs)=>{
      docs.forEach((doc)=>{
      usersData = doc.data();
    });
    res.render("biodata",{data:usersData});
  })
});

app.get('/profilesubmit',function(req,res){
  var usersData = {};
  db.collection('users')
    .where("Email", '==' , E)
    .where("Password",'==',P)
    .get()
    .then((docs)=>{
      docs.forEach((doc)=>{
      usersData = doc.data();
    });
    res.render("profile",{data:usersData});
  })
});


app.get('/complaintsubmit', (req, res) => {
  res.render("complaints");
});

app.get('/complaintsubmit1', (req, res) => {
  db.collection('complaints').add({
    type : req.query.type,
    complaint: req.query.x,
  })
  .then(()=>{
    res.send("Complaint sent successfully");
});
});

app.get("/logoutsubmit", (req,res) => {
	res.render("main");
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
