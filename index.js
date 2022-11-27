const express = require('express')
const app = express()
const port = 3000

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

app.get('/register', (req, res) => {
  res.render('signup.ejs');
})
app.get('/login', (req, res) => {
  res.render('signin.ejs');
})

app.get('/signinsubmit',(req, res)=>{
  const Email = req.query.Email;
  const Password = req.query.Password;

  db.collection("users")
    .where("Email", "==", Email)
    .where("Password", "==", Password)
    .get()
    .then((docs)=>{
      if(docs.size>0){
        var usersData = [];
        db.collection("users")
          .get()
          .then((docs)=>{
            docs.forEach((doc)=>{
              usersData.push(doc.data());
            })
        })
        .then(()=>{
          res.render("dashboard.ejs",{userData: usersData})
        })
        
      }
      else{
        res.send("Invalid Login")
      }
    })

})

app.get('/signupsubmit',(req, res)=>{
  const FullName = req.query.FullName;
  const RollNumber = req.query.RollNumber;
  const Email = req.query.Email;
  const Password = req.query.Password;
  const Confirm = req.query.ConfirmPassword;
  db.collection("users").add({
    Name: FullName,
    RollNumber: RollNumber,
    Email: Email,
    Password: Password,
    Confirm: Confirm,
}).then(()=>{
  res.render("success.ejs");
});
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
