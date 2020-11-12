const express = require("express");
const bodyParser = require ("body-parser");
const https = require("https");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine','ejs');

var today = new Date();

    var options = {
        weekday:"short",
        day:"numeric",
        month:"long",

    };

    var day = today.toLocaleDateString("en-US", options);
    


app.get ("/", function(req, res){
    console.log(day);
    // res.sendFile(__dirname + "/list.ejs");
    res.render("list", {kindOfDay:day});
})




app.post("/", function (req, res) {
    
    const companyName = req.body.cName;
    const businessPhone = req.body.bPhone;
    const email = req.body.email;
    console.log(companyName,businessPhone,email);


    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    CNAME:companyName,
                    PHONE:businessPhone,
                    
                }
                
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "ENTER MAILCHIMP URL/ API";
    const options = {
        method: "POST",
        auth: "ENTER USERNAME: API AUTH"
    }
    const request =https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname +"/failure.html")
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

app.listen(process.env.PORT ||3000, function(){
    console.log("Port is listening on 3000");
});
