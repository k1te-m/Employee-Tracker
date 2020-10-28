// Dependencies
const inquirer = require("inquirer");

// Inquirer Prompt Questions

const initQuestions = [
  {
    type: "list",
    choices: [
      "Add Departments/Roles/Employees",
      "View Departments/Roles/Employees",
      "Update Employee Roles",
      "EXIT",
    ],
    name: "action",
    message:
      "Welcome to the Widget Company Employee Management System. Please select an action.",
  },
];


// Functions

function init() {
    inquirer.prompt(initQuestions).then(userAction => {
        const { action } = userAction;
        console.log(action);
        // switch (action) {
        //     case "Add Departments/Roles/Employees"
        // }
    })
}

module.exports = init;