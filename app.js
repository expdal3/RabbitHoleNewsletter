const express = require("express");
const https = require("https");

const bodyParser = require("body-parser");
const app = express();

//**create "public" folder to host static folder (for css and images)
// so that these can be "broadcasted" by server nodemon
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true })); //extended: true allow to post method object

app.get("/", function(req, res) {
    //when people request home route "/" --> server deliver "/signup.html file"
    res.sendFile(__dirname + "/signup.html");
});



app.post("/", function(req, res) {

    // Parse the data from the signup page
    const fName = req.body.inputFirstName;
    const lName = req.body.inputLastName;
    const Email = req.body.inputEmail;

    const data = {
        members: [{
            email_address: Email,
            status: "subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName
            },
        }],
    };
    const jsonData = JSON.stringify(data);

    //send a post request to MailChimp API endpoint via https.request
    const url = 'https://us7.api.mailchimp.com/3.0/lists/bb1b099fef';
    const options = {
        method: "POST",
        auth: "expdal3@gmail.com:f980408170f4a1f7b63f6b19f2bcb0c6-us7" //<--use basic HTTP authentication method
    };
    const RequestWithData = https.request(url, options, function(respp) {
        // console.log(respp.statusCode);
        if (respp.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        respp.on("data", function(data) {
            console.log(JSON.parse(data)); //the requester ENDPOINT listen out for any JSON data (jsonData) to be parse
        })
    });

    //write the jsonData accompanied with the https.request to the ENDPOINT
    RequestWithData.write(jsonData);
    RequestWithData.end();
});

//route for try-again scenario
app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() { //process.env.PORT is for random port given by HEROKU  
    console.log("Server is running on port 3000.")
});



//MailChimp APIkey
// f980408170f4a1f7b63f6b19f2bcb0c6-us7

//MailChimp List ID
// bb1b099fef