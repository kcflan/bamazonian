const mysql = require('mysql');
const inquirer = require('inquirer');
const dotenv = require('dotenv').config();
let keys = require('./keys.js');

// create the connection information for the sql database
let connection = mysql.createConnection(keys.connectDB);

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  mgrStart();
});

let mgrStart = () => {
  inquirer
    .prompt([
      {
        name: 'action',
        type: 'list',
        message: 'What do you want to manage, Dwight Schrute?',
        choices: [
          'View Products for Sale',
          'View Low Inventory',
          'Add to Inventory',
          'Add New Product'
        ]
      }
    ])
    .then(function(answer) {
      switch (answer.action) {
        case 'View Products for Sale':
          viewAllProducts();
          break;
        case 'View Low Inventory':
          viewLowInventory();
          break;
        case 'Add to Inventory':
          addInventory();
          break;
        case 'Add New Product':
          //   addProduct();
          console.log('go');

          break;
      }
    });
};

let viewAllProducts = () => {
  connection.query(
    'SELECT * FROM products WHERE prod_name IS NOT NULL',
    (err, results) => {
      if (err) throw err;

      console.log('\n~~~~~~~~~~~~~~~~~~~~~~\nAll available items in DB:\n');

      let productsArray = [];
      for (i of results) {
        productsArray.push(`${i.id} - ${i.prod_name} - (Price: \$${i.price}) - (Stock: ${i.quantity})`);
      }

      console.log(productsArray);

      connection.end();
    }
  );
}
let viewLowInventory = () => {
    connection.query(
      'SELECT * FROM products WHERE quantity < 5',
      (err, results) => {
        if (err) throw err;
  
        console.log('\n~~~~~~~~~~~~~~~~~~~~~~\nLow Inventory Items (Less Than 5 Items) in DB:\n');
  
        let productsArray = [];
        for (i of results) {
          productsArray.push(`${i.id} - ${i.prod_name} - (Price: \$${i.price}) - (Stock: ${i.quantity})`);
        }
  
        console.log(productsArray);
  
        connection.end();
      }
    );
  }

  let addInventory = () => {
    connection.query(
      'SELECT * FROM products',
      function(err, results) {
        if (err) {
          throw err;
        }
  
        inquirer
          .prompt([
            {
              name: 'id',
              type: 'list',
              choices: () => {
                let choiceArray = [];
                for (i of results) {
                  choiceArray.push(
                    `${i.id} - ${i.prod_name} - (Price: \$${i.price}) - (Stock: ${
                      i.quantity
                    })`
                  );
                }
                return choiceArray;
              },
              message: "What is the Product ID you're looking to add stock?",
              validate: function(value) {
                //greatBayBasic.js
                if (isNaN(value) === false && parseInt(value) > 0) {
                  return true;
                }
                return false;
              }
            },
            {
              name: 'quantity',
              message: 'How many units do you want to add?',
              default: '1',
              validate: function(value) {
                if (isNaN(value) === false && parseInt(value) > 0) {
                  return true;
                }
                return false;
              }
            }
          ])
          .then(answer => { 
            let id = parseInt(answer.id.split(' - ')[0]);
            addQuantity(id, answer.quantity);
          });
      }
    );
  };
  let addQuantity = (id, quantity) => {    
    connection.query('UPDATE products SET ? WHERE ?',
    [
      {
        quantity: quantity
      },
      {
        id: id
      }
    ],
    (err) => {
      if (err) throw err;      
      console.log('Inventory has been added, Dwight!\n');  
      connection.end();           
    });
  }


