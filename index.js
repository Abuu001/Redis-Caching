const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const redis = require("redis");

const PORT = 3004;

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.json());

app.use(methodOverride("_method"));

//create redis client
let client =redis.createClient();
client.on('connect',()=>{
    console.log("Connected to Redis.... ")
})

app.get("/", (req, res, next) => {
  res.render("searchusers");
}); 

app.post('/user/search',(req,res)=>{
    let id = req.body.id;
    client
})
 
app.listen(PORT, () => console.log("Server running on port 3004"));
