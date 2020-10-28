// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");


// Create Connection
const connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "",
    database: "widgetcompany_db",
  });


// Inquirer Prompt Questions

const initQs = [
  {
    type: "list",
    choices: [
      "Add Department/Role/Employee",
      "View Departments/Roles/Employees",
      "Update Employee Roles",
      "EXIT",
    ],
    name: "action",
    message:
      "Welcome to the Widget Company Employee Management System. Please select an action.",
  },
];

const addDREQs = [
  {
    type: "list",
    choices: ["Department", "Role", "Employee"],
    name: "addWhat",
    message: "What type of entity would you like to add?",
  },
];

const addDQs = [
{
    type: "input",
    name: "departmentName",
    message: "What is the new department name?"
}
]

// const addRQs = [
// {
//     type: "input",
//     name: "roleTitle",
//     message: "What is the role title?"
// },
// {
//     type: "number",
//     name: "roleSalary",
//     message: "What is the role salary?"
// },
// {
//     type: "list",
//     choices:
// }
// ]

// Functions

function addDepartment() {
    inquirer.prompt(addDQs).then(userDep => {
        const { departmentName } = userDep;
        connection.query(
            `INSERT INTO department SET name = "${departmentName}"`,
            function (err, res) {
                if (err) throw err;
                console.log(`${res.affectedRows} department added.\n Department: ${departmentName}`)
            }
        )
    })
};

function addRole() {

};

function addEmployee() {

};

function addEntity() {
    inquirer.prompt(addDREQs).then(userAdd => {
        const { addWhat } = userAdd;
        switch (addWhat) {
            case "Department":
                addDepartment();
                break;
            case "Role":
                break;
            case "Employee":
                break;
        }
    
    })
}

function init() {
    inquirer.prompt(initQs).then(userAction => {
        const { action } = userAction;
        console.log(action);
        switch (action) {
            case "Add Department/Role/Employee":
                addEntity();
                break;
            case "View Departments/Roles/Employees":
                break;
            case "Update Employee Roles":
                break;
            case "EXIT":
                connection.end();
                break;
        }
    })
}

module.exports = init, addEntity, addDepartment;