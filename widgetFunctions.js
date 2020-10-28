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
    message: "What is the new department name?",
  },
];


// Functions

function addDepartment() {
  inquirer.prompt(addDQs).then((userDep) => {
    const { departmentName } = userDep;
    connection.query(
      `INSERT INTO department SET name = "${departmentName}"`,
      function (err, res) {
        if (err) throw err;
        console.log(
          `${res.affectedRows} Department Added...\nDepartment: ${departmentName}\n-------------------------`
        );
        init();
      }
    );
  });
}

function getDepartments() {
  connection.query(
    `SELECT * FROM department`,
    function(err, res) {
      if (err) throw err;
      let departments = [];
      for (let index = 0; index < res.length; index++) {
        departments.push(res[index]);
      }
      console.log(departments);
      
      addRole(departments);
    }
  )
  
}

function addRole(departments) {
  let departmentNames = [];
  for (let index = 0; index < departments.length; index++) {
    departmentNames.push(departments[index].name);
  }

  const addRQs = [
    {
        type: "input",
        name: "roleTitle",
        message: "What is the role title?"
    },
    {
        type: "number",
        name: "roleSalary",
        message: "What is the role salary?"
    },
    {
        type: "list",
        name: "roleDepartment",
        choices: departmentNames,
        message: "What department does the role belong to?"
    }
  ]

  inquirer.prompt(addRQs).then(roleResponse => {
    const { roleTitle } = roleResponse;
    const { roleSalary } = roleResponse;
    const { roleDepartment } = roleResponse;
    let roleDepartmentId;
    
    for (let index = 0; index < departments.length; index++) {
      if (roleDepartment === departments[index].name) {
        roleDepartmentId = departments[index].id;
      }
    }

    

    connection.query(
      `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`, [`${roleTitle}`, roleSalary, roleDepartmentId]
      ,function(err, results){
        if (err) throw err;
        // console.log("Role created..." + results.affectedRows + " role(s) created.\n" + "-------------------------");
        console.log(`${roleTitle} role created... ${results.affectedRows} role(s) created in ${roleDepartment} department.\n------------------------`);
        init();
      }
    )
  })
  
}
  
  

function addEmployee() {}

function addEntity() {
  inquirer.prompt(addDREQs).then((userAdd) => {
    const { addWhat } = userAdd;
    switch (addWhat) {
      case "Department":
        addDepartment();
        break;
      case "Role":
        getDepartments();
        break;
      case "Employee":
        break;
    }
  });
}

function init() {
  inquirer.prompt(initQs).then((userAction) => {
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
        process.exit();
        break;
    }
  });
}

module.exports = init, addEntity, addDepartment, addRole, getDepartments;
