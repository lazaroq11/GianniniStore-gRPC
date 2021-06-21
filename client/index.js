const client = require("./client");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get("/", (req,res)=>{
    client.getAll(null, (err,data)=>{
        if(!err) {
            res.render("guitar",{
                results: data.guitars
            });
        }
    });

});

app.post("/save",(req,res)=>{
    let newGuitar = {
        name: req.body.name,
        model: req.body.model,
        corda: req.body.corda,
        material: req.body.material
    
    };

    client.insert(newGuitar, (err,data)=>{
        if(err) throw err;
        console.log("Guitar created sucessfully",data);
        res.redirect("/");
    });

});

    app.post("/update",(req,res)=>{
        const updateGuitar = {
            id : req.body.id,
            name: req.body.name,
            model: req.body.model,
            corda: req.body.corda,
            material: req.body.material
        
        };

    client.update(updateGuitar, (err,data)=>{
        if(err) throw err;

        console.log("Guitar updated successfully",data)
        res.redirect("/");
    });

});

    
app.post("/remove",(req,res)=>{
    client.remove({id: req.body.guitar_id}, (err, _) =>{
        if(err) throw err;

        console.log("Guitar removed sucessfully");
        res.redirect("/");
    });
      
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
      console.log("Server Running at port: %d",PORT);
});
