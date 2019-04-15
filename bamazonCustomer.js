var mysql = require("mysql");
var columnify = require('columnify');
var inquirer = require("inquirer");
// var columns = columnify(data, options);


var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readProducts();
  });

  function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM Products", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(columnify(res));
      youbuyNow();
    });
};

function youbuyNow() {
    inquirer.prompt({
        name: "action",
        type: "number",
        message: "What would product (ID) would you like to buy?"
    })
}