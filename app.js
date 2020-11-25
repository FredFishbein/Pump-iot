require('dotenv').config();
const express = require("express");
const bodyParser = require ("body-parser");
const https = require("https");
const request = require("request");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});
const userSchema = new mongoose.Schema ({
    email:String,
    password:String
});

userSchema.plugin(encrypt,{ secret: process.env.SECRET, encryptedFields: ['password']});
const User = new mongoose.model("User", userSchema);

// var today = new Date();

//     var options = {
//         weekday:"short",
//         day:"numeric",
//         month:"long",

//     };

// var day = today.toLocaleDateString("en-US", options);
    


app.get ("/", function(req, res){
    res.render("Main");
})

// Signup/Contact Section
app.post("/contact", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const companyName = req.body.cName;
    const businessPhone = req.body.bPhone;
    const email = req.body.email;
    const messageBody = req.body.mBody;
    const title =req.body.title;
    const cityName =req.body.citiesName;
    // console.log(firstName,lastName,companyName,businessPhone,email);


    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    CNAME:companyName,
                    BPHONE:businessPhone,
                    FNAME:firstName,
                    LNAME:lastName,
                    MESSAGE:messageBody,
                    TITLE:title,
                    CITY:cityName   
                }
                
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url= "process.env.URL";
    const options = {
        method: "POST",
        auth: "process.env.AUTH"
    }
    const request =https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.render("Success");
        }else{
            res.render("Failure")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
    });
    });


    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});
app.post("/success", function(req, res){
    res.redirect("/");
});
app.get("/blog", function(req,res){
    res.render("blog");
});
app.get("/about", function(req,res){
    res.render("about");
});
   app.get("/contact", function(req,res){
    res.render("contact");
}); 
app.get("/Success", function(req,res){
    res.render("Success");
});  
app.get("/Failure", function(req,res){
    res.render("Failure");
}); 
app.get("/login", function(req,res){
    res.render("login");
});
app.get("/register", function(req,res){
    res.render("register");
});


app.post("/register", function (req,res) {
    const NewUser = new User ({
        email: req.body.username,
        password:req.body.password
    });
    NewUser.save(function(err){
        if (err){
            console.log(err)
        }else{
            res.render("login");
        }    
    })
});
app.post("/login", function(req,res) {
    const username = req.body.username;
    const password =req.body.password;

    User.findOne({email:username}, function(err, foundUser){
    if(err) {
        console.log(err);
        }else{
            if(foundUser) {
                if(foundUser.password === password){
                    res.render("test");
                }
            }
        }
    });
});



app.listen(process.env.PORT ||3000, function(){
    console.log("Port is listening on 3000");
});
