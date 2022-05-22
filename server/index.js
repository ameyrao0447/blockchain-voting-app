//require the express app
var express = require('express');
 
//to call express
var app = express();
const dotenv = require("dotenv");
dotenv.config();
app.use(express.static('images')); 
app.use('/images', express.static('images'));
const cors = require('cors');

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' +file.originalname)
    }
  })
  
const upload = multer({ storage: storage }).single('file')

const mongoose = require("mongoose");
//connection to db
mongoose.connect(process.env.DB_CONNECT).then(() => {
console.log("Connected to db!");
app.listen(8080, function () {
    console.log('OSFY Test App listening on port 8080!')
    });
});

//mongoose models
const Election = require("./models/Election");
const User = require("./models/User");

//takes us to the root(/) URL
app.get('/', function (req, res) {
//when we visit the root URL express will respond with 'Hello World'
res.send('Hello World!');
});

app.post('/addElection',async (req, res) => {
    console.log(req.body);
    const _Election = new Election({
    electionName: req.body.electionName,
    electionImage: req.body.electionImage,
    electionDate: req.body.electionDate,
    candidates:req.body.candidates
    });
    try {
    await _Election.save();
    res.send('data added');
    } catch (err) {
        console.log(err);
        res.send('data not added');
    }
    });
app.get("/getAllElections", (req, res) => {
    Election.find({}, (err, tasks) => {
    res.send(tasks);

    });
    });
app.post('/getElection',async (req, res) => {
    try {
        Election.find({electionName:req.body.electionName},(err,data)=>{
            res.send(data);  
        })
    } catch (err) {
        console.log(err);
        res.send('data not found');
    }
    });
app.post('/getElectionById',async (req, res) => {
    try {
        Election.findById(req.body.id,(err,data)=>{
            res.send(data);  
        })
    } catch (err) {
        console.log(err);
        res.send('data not found');
    }
    });
//file upload 
app.post('/image', (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
      res.send(req.file);
    });
  });
//login and signUp
app.post('/signUp',async (req, res) => {
    const _user = new User(req.body);
    try {
    let data=await User.find({$or:
    [
    {userName:req.body.userName},
    {email:req.body.email},
    {aadhaar:req.body.aadhaar} ]
    }).exec();
    console.log(data);
    if(data!==undefined&&data!==null&&data.length==0)
    {
        await _user.save();
        res.send('data added');
    }
    else
    {
        for(let i=0;i<data.length;i++){

            if(data[i].userName===req.body.userName){
            res.send({error:'userName'});
            }
            else if(data[i].email===req.body.email){
                res.send({error:'email'});
            }
            else if(data[i].aadhaar===req.body.aadhaar){
                res.send({error:'aadhaar'});
            }
        }
    }
    } catch (err) {
        console.log(err);
        res.send('data not added');
    }
});
app.post('/login',async (req, res) => {
    if(req.body.userName!==null&&req.body.userName!==''){
        try {
            User.find({userName:req.body.userName,password:req.body.password},(err,data)=>{
                console.log(data);
                if(err||data.length<=0)
                res.send({error:err});
                else
                res.send({userName:req.body.userName,password:req.body.password});
            });
        } catch (err) {
            res.send({error:err});
        }
    }
    else if(req.body.aadhaar!==null&&req.body.aadhaar!==''){
        try {
            User.find({aadhaar:req.body.aadhaar},(err,data)=>{
                if(err||data!==null||data!==undefined||data.length<=0)
                res.send({error:err});
                else
                res.send({aadhaar:req.body.aadhaar});
            });
        } catch (err) {
            res.send({error:err});
        }
    }
    else
    res.send({error:'data not present'});
});

