const mysql = require("mysql");
const inquirer = require("inquirer");
const dotenv = require('dotenv').config();
let keys = require('./keys.js');

let command = process.argv[2];
// Get all elements in process.argv, starting from index 3 to the end
// Join them into a string to get the space delimited address
let args = process.argv.slice(3).join(' ');

// create the connection information for the sql database
var connection = mysql.createConnection(keys.connectDB);

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});
// function which prompts the user for what action they should take
let start = () => {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err){ throw err;}
  
  inquirer
    .prompt([{
      
        name: 'prodName',
        type: 'rawlist',
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(`${results[i].prod_name} - (Price: \$${results[i].price})`);            
          }
          return choiceArray;
        },
        message: 'What is the Product you\'re looking to purchase?',       
      },
      {
        name: 'quantity',
        message: 'How many units do you want to purchase?',
        default: '1',
        validate: function(value) {
          if (isNaN(value) === false && parseInt(value) > 0) {
            return true;
          }
          return false;
        }
      },
    ])
    .then(answers => {
      console.log(answers);
            
    });
  });
}

  