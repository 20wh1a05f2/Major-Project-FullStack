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
        res.render("signin", {msg: "Registered Succesfully. "});
    });
  }
  else{
    res.send("Registration Failed");
  }
});

app.get('/feedbacksubmit',(req, res)=>{
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
        const sem1 = req.query.sem1;
        const sem1lab = req.query.sem1lab;
        const sem2 = req.query.sem2;
        const sem2lab = req.query.sem2lab;
        const sem3 = req.query.sem3;
        const sem3lab = req.query.sem3lab;
        const sem4 = req.query.sem4;
        const sem4lab = req.query.sem4lab;
        const sem5 = req.query.sem5;
        const sem5lab = req.query.sem5lab;
        const sem6 = req.query.sem6;
        const sem6lab = req.query.sem6lab;
        const sem7 = req.query.sem7;
        const sem7lab = req.query.sem7lab;
        const sem8 = req.query.sem8;
        const sem8lab = req.query.sem8lab;
        db.collection("feedback").add({
          sem1: sem1,
          sem2: sem2,
          sem3: sem3,
          sem4: sem4,
          sem5: sem5,
          sem6: sem6,
          sem7: sem7,
          sem8: sem8,
        })
        .then(()=>{
            res.send("Feedback successfully submitted");
        });
    });
    });
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

app.get("/logoutsubmit", (req,res) => {
	res.render("main");
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})