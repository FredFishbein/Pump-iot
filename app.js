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
    res.sendFile(__dirname + "/list.ejs");
    res.render("list", {kindOfDay:day});
})




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
    const url = "https://us2.api.mailchimp.com/3.0/lists/42e33c70ab";
    const options = {
        method: "POST",
        auth: "haha:51721a111b1f8f6bd50b49fde3e068ae-us2"
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
app.get("/blog", function(req,res){
    res.render("blog");
   });
app.get("/about", function(req,res){
    res.render("about");
   });
   app.get("/contact", function(req,res){
    res.render("contact");
   });   





app.listen(process.env.PORT ||3000, function(){
    console.log("Port is listening on 3000");
});
