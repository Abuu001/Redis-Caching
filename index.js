const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const methodOverride = require("method-override");
const redis = require("redis");

const PORT = 3004;

app.use(express.json());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(methodOverride("_method"));
/**
 * NB
 * you must start redis server --> redis-server
 * redis-cli
 */ 

//create redis client
let client = redis.createClient();
client.on("connect", () => {
  console.log("Connected to Redis.... ");
});

app.get('/',(req,res)=>{
   res.render('searchusers')
})

app.post("/user/search", (req, res) => {

  let id = req.body.id;
  console.log(id)
  client.hgetall(id, (err, obj) => {  
    // console.log(obj)
    if (!obj ) {
      res.render("searchusers", {
        error: "User does not exist",
      });
    } else {
      obj.id = id;
      res.render("details", {
        user: obj,
      });
    }
  });
});

app.get('/user/add',(req,res)=>{
  res.render('adduser')
})

app.post('/user/add',(req,res)=>{
  const {first_name,last_name,id,phone,email} =req.body;

  client.hmset(id,[
    'first_name' , first_name,
    'last_name' , last_name,
    'email' ,email,
    'phone', phone
  ],(err,reply)=>{
    if(err){
      console.log(err)
    }else{ 
      console.log(reply) 
      res.redirect('/')
    }
  })
}) 

app.delete('/users/delete/:id',(req,res)=>{
  client.del(req.params.id);
  res.redirect('/')
});

app.listen(PORT, () => console.log("Server running on port 3004"));
