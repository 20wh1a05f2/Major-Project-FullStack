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

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('main.ejs');
})

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
  const Email = req.query.Email;
  const Password = req.query.Password;
  var usersData = {};
  var flag = false;
  db.collection("users")
    .where("Email", "==", Email)
    .where("Password", "==", Password)
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
  res.render("feedback");
})
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

app.get('/complaintsubmit', (req, res) => {
  res.render("complaints");
});

app.get("/logoutsubmit", (req,res) => {
	res.render("main");
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})