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
  //checks connection to database
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readProducts();
  });
  
//displays all the products in db
  function readProducts() {
    console.log("Finding all products...\n");
    connection.query("SELECT * FROM Products", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(columnify(res));
    
      whatsUp();
    //   youbuyNow();
    });
    
};

// var purchaseNum = connection.query("SELECT stock_quantity FROM bamazon_db.products WHERE item_id = " + answer.whatyoubuy, function (err, res) {
    
function whatsUp() {
    inquirer.prompt([
        {
        name: "wannaBuy",
        type: "list",
        message: "What would you like to do?",
        choices: 
        [
            "Buy something",
            "EXIT"
    ]
        }
    ]).then(function(answer) {
        if (answer.wannaBuy === "Buy something") {
            youbuyNow();
        }
        else {
            console.log("Ok. Bye now!")
            connection.end();
        }
    })
}
//prompts the user what do they want to do?
function youbuyNow() {
    inquirer.prompt([
        {
            name: "whatyoubuy",
            type: "number",
            message: "What product (ID) would you like to buy?"
        },

        {
            name: "howmany",
            type: "number",
            message: "How many would you like to buy?"
        }
    
]).then(function(answer) {
    connection.query("SELECT stock_quantity, price FROM bamazon_db.products WHERE ?",
    {
        item_id: answer.whatyoubuy
    },
    function (err, res){
        if (answer.howmany > res[0].stock_quantity) {
            console.log("Insuficiant Quantity")
            console.log("There are only " + res[0].stock_quantity + " in stock!")
            inquirer.prompt([
                {
                name: "retry",
                type:"list",
                message: "Do you want to try another quantity?",
                choices: 
                [
                "Yes, I'd like to try another quantity.",
                "No, I'd like to exit."
                ]
                }

            ]).then(function(answer){
                if (answer.retry === "No, I'd like to exit.") {
                    console.log("Ok. See you later!");
                    connection.end();
                }
                else {
                    youbuyNow();
                }
            })
        }
        
        else {
            console.log("Updating Stock");
            connection.query("UPDATE Products SET ? WHERE ?",
            [
                {
                    stock_quantity: res[0].stock_quantity - answer.howmany
                },
                {
                    item_id: answer.whatyoubuy
                }
            ]);

            console.log(`Your total is: $${res[0].price * answer.howmany} `)
            readProducts();
        }
    })

    function updateStock() {
        
    }
    
    })

    
}