//Require packages
const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');
const https = require('https');

//Set up express.js and body-parser
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

//Use local stylesheet along with bootstrap
app.use(express.static("public"));

//Upon receiving get request to root, send signup.html as response "res"
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");

});


//Save first name, last name and email address given by user to a const
app.post("/", function(req, res) {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.email;


// initialize js object "data" with keys to match MailChimp keys with values provided by the user
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }]
  }




// Convert js object "data" to JSON format via JSON.stringify()
  const jsonData = JSON.stringify(data);
  //specify url where the part after ../lists/ equals lists id
  const url = "https://us19.api.mailchimp.com/3.0/lists/f526a40c9d";

//specify method, and author + API key
  const options = {
    method: "POST",
    auth: "juha1:83923cb3a4ca4f4a7e857c781f39ee0b-us19"
  }


    //Make a POST request to MailChimp
   const request = https.request(url, options, function(response) {

     //if API key AND lists id (see const options = { auth "juha1:x"} for CORRECT lists id) is correct, response.statusCode will equal 200, and then the user will be redirected to  success.html
    if (response.statusCode === 200) {
      res.sendFile(__dirname+"/success.html");

      //If API key OR lists id is wrong then response.statusCode will be in the 400 range and user will be redirected to failure.html
    } else {
      res.sendFile(__dirname+"/failure.html");
      console.log(response.statusCode);
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
request.write(jsonData);
request.end();})


//Upon failure, redirect user back to signup.html
app.post("/failure", function(req,res) {
  res.redirect("/");
})









//Start server
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is up and running on port"+process.env.PORT+"."); })
