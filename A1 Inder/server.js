
//   import express
const express = require("express")

//  create a web server
const app = express()

//Define port
const HTTP_PORT = process.env.PORT || 8080

// endpoint that send a file
const path = require("path")

// configure express to receive data from <form> elements
app.use(express.urlencoded({extended:true}))
app.use(express.static("assets"))



//Global variablas
const _num_parked = []
const _userId = "admin"
const _password = 0000
// ------------------ ENDPOINTS (path, routes) ------- // 

//home endpoint
app.get("/", (req, res) => {
    // address http://localhost:8080/t
    res.sendFile(path.join(__dirname,  "home.html"))
})

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "admin.html"))
})

app.post("/_parking", (req, res) => {

    // ----------
    // SECTION 1: Extracting data from the form
    // ---------
    let rate = 0
    let taxable = 0
    let tax = 0
    let total = 0
    const lot =req.body.lot
    const Hours = req.body.Hours
    const licensePlate = req.body.license

    console.log(`rate: ${Hours}`);
    console.log(`taxable: ${licensePlate}`);
    console.log(`lot: ${lot}`);
    console.log(`total: ${total}`);

    // ----------
    // SECTION 2: Converting the data to required type :NONE
    // ---------
    // ----------
    // SECTION 3: Form data validation goes here:N
    // ---------

    if (licensePlate === "") {
     res.send("Please provide License plate")
     return
 }
 
 if (Hours === "") {
     res.send("Please provide number of hours")
     return
 }
 
 if (isNaN(parseInt(Hours))) {
     res.send("Please provide a valid number of hour(s)")
     return
 }
 
 if (Hours<1 || Hours>8) {
     res.send("Number of hours should be minimum 1 and maximum 8")
     return
 }

   // SECTION 4: Main endpoint logic
 

 if (lot === "A") {
        rate = 3.25
        taxable = rate * Hours
        tax = 0.13 * taxable
        total = taxable + tax
    }

 if (lot === "B") {
    rate = 1.50
    taxable = rate * Hours
    tax = 0.13 * taxable
    total = taxable + tax
    }

 if (lot === "C") {
    rate = 5.75
    taxable = rate * Hours
    tax = 0.13 * taxable
    total = taxable + tax
    }

 const receipt = {
    Number_of_hours: Hours,
    rate: rate,
    subtotal: taxable,
    tax: tax,
    totalcost: total
}

 _num_parked.push(receipt)
 res.send(
    `
    <h1>Your Receipt:</h1>
    <p>Hours Requested: ${Hours}</p>
    <p>Hourly Rate: $${rate} per hour</p>
    <p>Sub total: $${taxable.toFixed(2)}</p>
    <p>Total: $${total.toFixed(2)}</p>
    <p>Tax: $${tax.toFixed(2)}</p>
    <h3>You must pay: $${total.toFixed(2)}</h3>
    `
    )
 return
})

app.post("/login", (req, res) => {

    const Username = req.body.username
    const Password = req.body.password

    const _num_cars = _num_parked.length
    let total = 0

    if((Username !== _userId) && (Password !== _password)) {
        res.send("Invalid username or password")
    }

    if((Username === _userId) && (parseInt(Password) === _password)) {
        for(let i=0; i < _num_parked.length; i++) {
            total = total + _num_parked[i].totalcost
        }
        res.send(
            `
            <p>Total number of cars ${_num_cars}</p>

            <p>Total Money collected ${total.toFixed(2)}</p>
            `
            )
        return
    }

})

// ------------------ ENDPOINTS (path, routes) ------- //

//-----------------Server_Start---------------------//
// function that will run when the server starts
const onHttpStart = () => {
    console.log("Express http server listening on: " + HTTP_PORT);
    console.log(`http://localhost:${HTTP_PORT}`);
}

// the code that actually runs the web server app
app.listen(HTTP_PORT, onHttpStart)







 