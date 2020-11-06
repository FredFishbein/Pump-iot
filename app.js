const express = require("express");
const bodyParser = require ("body-parser");
const https = require("https");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get ("/", function(req, res){
    res.sendFile(__dirname + "/pump-main.html");

})


app.post("/", function (req, res) {
    const email = req.body.email;
    console.log(email);


    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                
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

app.listen(process.env.PORT ||3000, function(){
    console.log("Port is listening on 3000");
});
