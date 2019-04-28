DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  prod_name VARCHAR(100) NOT NULL,
  dept_name VARCHAR(45) NOT NULL,
  price DECIMAL(6,2) default 0,
  quantity INT default 0,
  PRIMARY KEY (id)
);

SELECT * FROM products;

INSERT INTO products (prod_name, dept_name, price, quantity) VALUES ("Blender", "Kitchen", 39.50, 6);
INSERT INTO products (prod_name, dept_name, price, quantity) VALUES ("Pencil Case", "Office", 4.25, 10);
INSERT INTO products (prod_name, dept_name, price, quantity) VALUES ("Phone Case", "Electronics", 12, 4);
INSERT INTO products (prod_name, dept_name, price, quantity) VALUES ("Area Rug", "Household", 89.99, 2);
INSERT INTO products (prod_name, dept_name, price, quantity) VALUES ("Watch", "Jewelry", 112.87, 16);
INSERT INTO products (prod_name, dept_name, price, quantity) VALUES ("Titanium Ring", "Jewelry", 63.34, 1);
INSERT INTO products (prod_name, dept_name, price, quantity) VALUES ("Toaster", "Kitchen", 49.99, 16);
INSERT INTO products (prod_name, dept_name, price, quantity) VALUES ("Headphones", "Electronics", 19.99, 42);
INSERT INTO products (prod_name, dept_name, price, quantity) VALUES ("Nest Thermostat", "Electronics", 199.99, 5);
INSERT INTO products (prod_name, dept_name, price, quantity) VALUES ("North Face Jacket", "Clothing", 89.97, 7);
