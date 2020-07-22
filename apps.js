const express = require("express");
const app = express();
const request = require("request");
const pool = require("./dbPool.js")

app.set("view engine", "ejs");
app.use(express.static("public"));
//routes
app.get("/", async function(req, res){
    
    let imageURLArray = await getRandomImage("",1);
    res.render("index" , {"imageURLArray" : imageURLArray});
});


app.get("/search", async function(req,res){
    
    let keyword = "";
    if(req.query.keyword){
        keyword = req.query.keyword;
    }
    
    let imageURLArray = await getRandomImage(keyword , 9);
    res.render("results" , {"imageURLArray" : imageURLArray});
    
});

app.get("/api/updateFavorites", function(req, res){
  let sql;
  let sqlParams;
  switch (req.query.action) {
    case "add": sql = "INSERT INTO favorites (imageUrl, keyword) VALUES (?,?)";
                sqlParams = [req.query.imageURL, req.query.keyword];
                break;
    case "delete": sql = "DELETE FROM favorites WHERE imageUrl = ?";
                sqlParams = [req.query.imageURL];
                break;
  }//switch
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows.affectedRows.toString());
  });
    
});//api/updateFavorites

app.get("/getKeywords",  function(req, res) {
  let sql = "SELECT DISTINCT keyword FROM favorites ORDER BY keyword";
  let imageURLArray = ["img/favorite.png"];
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("favorites", {"imageURLArray": imageURLArray, "rows":rows});
  });  
});//getKeywords

app.get("/api/getFavorites", function(req, res){
  let sql = "SELECT imageURL FROM favorites WHERE keyword = ?";
  let sqlParams = [req.query.keyword];  
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows);
  });
    
});//api/getFavorites

function getRandomImage(keyword, count) {
    return new Promise (function(resolve,reject){
        
        let requestURL = `https://api.unsplash.com/photos/random/?count=${count}&client_id=JMOhUo0HZmuQ9olIN7ojW4IjoT8qQOuAmwt6bfX_j8s&featured=true&orientation=landscape&query=${keyword}`;
        request(requestURL, function(error, response, body){
            
            if(!error && response.statusCode == 200){
                let parseData = JSON.parse(body);
                
                let imageURLArray = [];
                for(let i = 0; i < count; i ++)
                {
                    imageURLArray.push(parseData[i]["urls"]["regular"])
                }
                resolve(imageURLArray);
            }
            else{
                console.log('error', error);
                console.log('statusCode', response && response.statusCode);
                reject(error);
            }
        
        });
    });
}


//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running...");
} );