const mysql = require('mysql');
const inquirer = require('inquirer');
const dotenv = require('dotenv').config();
let keys = require('./keys.js');
const Table = require('cli-table');

// create the connection information for the sql database
let connection = mysql.createConnection(keys.connectDB);

// connect to the mysql server and sql database
connection.connect((err) => {
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
          'Add New Product',
          'EXIT'
        ]
      }
    ])
    .then(answer => {
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
          addProduct();
          break;
        default:            
          connection.end();    
          process.exit();
          //break;
      }
    });
};

let viewAllProducts = () => {  
  connection.query(
    'SELECT * FROM products WHERE prod_name IS NOT NULL',
    (err, results) => {
      if (err) throw err;

      console.log('\n~~~~~~~~~~~~~~~~~~~~~~~~~~\nAll available items in DB:\n');

      // let productsArray = [];
      let productsTable = new Table({
        head: ['Product ID','Product Name','Price', 'Quantity'],
        colWidths: [12,28,12,18]
      }); 
      for (i of results) {
        // productsArray.push(`[ID: ${i.id}] - ${i.prod_name} - (Price: \$${i.price}) - (Stock: ${i.quantity})`);
        productsTable.push([`${i.id}`, `${i.prod_name}`, `\$${Number(i.price).toFixed(2)}`, `${i.quantity}`]);
      }

      // console.log(productsArray);
      console.log(productsTable.toString());
    
      // console.table(productsArray);//thanks to bryce in t/th class for making me think about console.table,
      // I found npm  cli-table3 to implement if I have time, I didn't like console.table 
      mgrStart();//running the prompts again instead of closing the connection
      // connection.end(); 
    }
  );
}
let viewLowInventory = () => {
  
    connection.query(
      'SELECT * FROM products WHERE quantity < 5',
      (err, results) => {
        if (err) throw err;
  
        console.log('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nLow Inventory Items (Less Than 5 Items) in DB:\n');
        let lowProductsTable = new Table({
          head: ['Product ID','Product Name','Price', 'Quantity'],
          colWidths: [12,28,12,18]
        });         
        for (i of results) {
          // productsArray.push(`[ID: ${i.id}] - ${i.prod_name} - (Price: \$${i.price}) - (Stock: ${i.quantity})`);
          lowProductsTable.push([`${i.id}`, `${i.prod_name}`, `\$${Number(i.price).toFixed(2)}`, `${i.quantity}`]);
        }
  
        // console.log(productsArray);        
        console.log(lowProductsTable.toString());
        
        mgrStart();//running the prompts again instead of closing the connection
        // connection.end();
      }
    );
  }

  let addInventory = () => {
    connection.query(
      'SELECT * FROM products',
      (err, results) => {
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
                  choiceArray.push(`${i.id} - ${i.prod_name} - (Price: \$${i.price}) - (Stock: ${i.quantity})`
                  );
                }
                return choiceArray;
              },
              message: "What is the Product ID you're looking to add stock?",
              validate: (value) => {
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
              validate: (value) => {
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
      console.log('Inventory has been added, Manager Dwight!\n'); 
      mgrStart();//running the prompts again instead of closing the connection
        // connection.end();
    });
  }

  let addProduct = () => {
    inquirer
    .prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Product Name:'
      },
      {
        name: 'department',
        type: 'input',
        message: 'Department:'
      },
      {
        name: 'price',
        type: 'input',
        message: 'Price:',
        validate: (val) => {
          if (isNaN(val) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: 'quantity',
        type: 'input',
        message: 'Quantity:',
        validate: (val) => {
          if (isNaN(val) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then((product) => {
        
      connection.query('INSERT INTO products SET ?',
        {
          prod_name: product.name,
          dept_name: product.department,
          price: product.price,
          quantity: product.quantity
        },
        (err) => {
          if (err) throw err;  
          console.log(`The Bamazonians have procured and successfully added ${product.name} to the stock!\n`);  
          mgrStart();//running the prompts again instead of closing the connection
        // connection.end();  
        }
      );
    });
  }

