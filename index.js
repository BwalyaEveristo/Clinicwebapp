/* const Here we have used a constant 
variable as we are not going to change its value.*/

const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);


const db = mysql.createConnection({
    host: "localhost" ,    
    user: "kapanshya",    
    password: "", 
    database: "Ward",  
    
  });

  //====== connecting to the Database ======= //
  db.connect((err) => {
    if (err) {
      throw err;
    } else {
      console.log('Connected to the database');
    }
  });

  module.exports =db;
  
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(express.static(__dirname));

  app.use(express.static(__dirname + '/public'));

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

  // ==== Connecting to Databse to Databse 2 ===== //

  const db2 = mysql.createConnection({
    host: 'localhost',
    user: 'kapanshya',
    password:'',
    database: 'NurseLogin'
  });

  db2.connect((err) =>{
    if(err){
      throw err;

    }else {
      console.log("Connected to database 2");
    }
  })
 // =======> Checking for login credentials <======= ///

  app.post('/process-form', (req, res) => {
    // Access form data from req.body
    const username = req.body.idNumber;
    const password = req.body.password;
  
    // Query the database to check credentials
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db2.query(query, [username, password], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      if (results.length === 1) {
        // Successful login
        res.redirect('/dashboard.html');
      } else {
        // Invalid credentials
        res.status(401).send('Invalid username or password');
      }
    });
  });
  
 
 // ====> Ejs to display Patient Table <====== //
app.set('view engine', 'ejs');

 // route prefix
 app.use("", require("./routes/routes"));
 



/* app.get('/patients', (request, response) => {
  // Query  MySQL database to retrieve data
  console.log('Query executed successfully.');
  db.query('SELECT * FROM patient', (error, results) => {
    if (error) {
      console.error('Error querying the database: ' + error.stack);
      response.status(500).send('Error fetching data from the database.');
      return;
    }
    // use res.render to load up an ejs view file
    // Render the data as a  using EJS template
    console.log("Rendering patients.ejs"); 
    response.render('patients', { data: results });
    
  });
  console.log('Query executed successfully.');
});
*/

/*const sessionStore = new MySQLStore({
  expiration: 3600000, // Session expiration time in milliseconds (optional)
  createDatabaseTable: true, // Automatically create the sessions table (optional)
}, db);

app.use(session({
  secret: 'your-secret-key', // Change this to a secure secret
  resave: false,
  saveUninitialized: true,
  store: sessionStore, // Use the MySQL store
}));

app.get('/logout', (req,res)=> {
  req.session.destroy((err)=>{
    if(err){
      console.error(err);
    }else {
      res.redirect('/');
    }
  });
});
*/
  
app.listen(3001, ()=> {
    console.log("Server started at http://localhost:3001");
});



