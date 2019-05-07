const mysql = require('mysql');
const inquirer = require('inquirer');
const dotenv = require('dotenv').config();
let keys = require('./keys.js');

// create the connection information for the sql database
let connection = mysql.createConnection(keys.connectDB);

// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});
// function which prompts the user for what action they should take
let start = () => {
  connection.query(
    'SELECT * FROM products WHERE prod_name IS NOT NULL',
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
                choiceArray.push(
                  `${i.id} - ${i.prod_name} - (Price: \$${Number(i.price).toFixed(2)}) - (Stock: ${
                    i.quantity
                  })`
                );
              }
              return choiceArray;
            },
            message: "What is the Product ID you're looking to purchase?",
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
            message: 'How many units do you want to purchase?',
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
          // console.log(answer.id,answer.quantity);

          let id = parseInt(answer.id.split(' - ')[0]);
          checkQuantity(id, answer.quantity);
        });
    }
  );
};
// check quantity in stock
let checkQuantity = (id, quantityDesired) => {
  connection.query(
    'SELECT `prod_name`, `quantity`, `price` FROM products WHERE id = "' +
      id +
      '"',
    (err, res) => {
      if (err) throw err;
      let product = res[0].prod_name;
      let stockQuantity = res[0].quantity;
      let price = res[0].price;
      // console.log(price);

      if (stockQuantity < quantityDesired) {
        console.log(
          `\nBamazon does not currently have enough of ${product} in stock to fulfill you order.\n`
        );
        start();
      } else {
        let subTotal = Number(price * quantityDesired).toFixed(2);
        console.log(
          `\n~~~~~~~~~~~~~~~BAMazon!~~~~~~~~~~~~~~~\nYour order summary:\nItem: ${product}\nQuantity: ${quantityDesired}\nYour order has been placed for \$${subTotal} The Bamazonians are processing it...\n\n`
        );
        placeOrder(id, stockQuantity, quantityDesired);
      }
    }
  );
}

let placeOrder = (id, stock, order) => {
  stock -= order;
  // update quantity in stock
  connection.query(
    'UPDATE products SET ? WHERE ?',
    [
      {
        quantity: stock
      },
      {
        id: id
      }
    ],
    err => {
      if (err) throw err;
      console.log('Please come visit us again!\n');
      connection.end();
    }
  );
}
