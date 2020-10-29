// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");

// Create Connection
const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "root",
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

const viewWhat = [
  {
    type: "list",
    choices: ["View Departments", "View Roles", "View Employees"],
    name: "view",
    message: "What table would you like to view?",
  },
];

// Add Functions

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
  connection.query(`SELECT * FROM department`, function (err, res) {
    if (err) throw err;
    let departments = [];
    for (let index = 0; index < res.length; index++) {
      departments.push(res[index]);
    }

    addRole(departments);
  });
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
      message: "What is the role title?",
    },
    {
      type: "number",
      name: "roleSalary",
      message: "What is the role salary?",
    },
    {
      type: "list",
      name: "roleDepartment",
      choices: departmentNames,
      message: "What department does the role belong to?",
    },
  ];

  inquirer.prompt(addRQs).then((roleResponse) => {
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
      `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`,
      [`${roleTitle}`, roleSalary, roleDepartmentId],
      function (err, results) {
        if (err) throw err;
        console.log(
          `${roleTitle} role created... ${results.affectedRows} role(s) created in ${roleDepartment} department.\n------------------------`
        );
        init();
      }
    );
  });
}

// Combine getRoles and getEmployees with better mySQL query
function getRoles() {
  connection.query(`SELECT * from role`, function (err, res) {
    if (err) throw err;
    let roles = [];

    for (let index = 0; index < res.length; index++) {
      roles.push(res[index]);
    }
    getEmployees(roles);
  });
}

function getEmployees(roles) {
  connection.query(`SELECT id, first_name, last_name from employee`, function (
    err,
    res
  ) {
    if (err) throw err;
    let employees = [];
    for (let index = 0; index < res.length; index++) {
      employees.push(res[index]);
    }
    addEmployee(roles, employees);
  });
}

function addEmployee(roles, employees) {
  let roleTitles = [];
  let employeeNames = ["N/A"];
  for (let index = 0; index < employees.length; index++) {
    employeeNames.push(employees[index].last_name);
  }
  for (let index = 0; index < roles.length; index++) {
    roleTitles.push(roles[index].title);
  }

  const addEQs = [
    {
      type: "input",
      name: "firstname",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "lastname",
      message: "What is the employees last name?",
    },
    {
      type: "list",
      name: "roleTitle",
      choices: roleTitles,
      message: "What is the employee's role?",
    },
    {
      type: "list",
      name: "managerName",
      choices: employeeNames,
      message: "Who does this employee currently report to?",
    },
  ];

  inquirer.prompt(addEQs).then((empResponse) => {
    const { firstname } = empResponse;
    const { lastname } = empResponse;
    const { roleTitle } = empResponse;
    const { managerName } = empResponse;
    let roleID;
    let managerID;

    for (let index = 0; index < roles.length; index++) {
      if (roleTitle === roles[index].title) {
        roleID = roles[index].id;
      }
    }

    for (let index = 0; index < employees.length; index++) {
      if (managerName === employees[index].last_name) {
        managerID = employees[index].id;
      }
    }

    connection.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
      [`${firstname}`, `${lastname}`, roleID, managerID],
      function (err, results) {
        if (err) throw err;
        console.log(
          `Success... ${firstname} ${lastname} has been successfully added to the database.`
        );
        init();
      }
    );
  });
}

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
        getRoles();
        break;
    }
  });
}

// View Functions

function viewDepartments() {
  connection.query("SELECT id, name AS Department FROM department", function (
    err,
    res
  ) {
    if (err) throw err;
    console.log(res);

    console.table(res);
    init();
  });
}

function viewRoles() {
  connection.query(
    "SELECT role.id, title AS Role, salary AS Salary, department.name AS Department FROM role JOIN department ON role.department_id = department.id ORDER BY role.id",
    function (err, res) {
      if (err) throw err;

      console.table(res);
      init();
    }
  );
}

function viewEmployees() {
  connection.query(
    "SELECT employee.id, first_name AS FirstName, last_name AS LastName, manager_id AS ManagerID,department.name AS Department, title AS Title, salary AS Salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department.name",
    function (err, res) {
      if (err) throw err;

      console.table(res);
      init();
    }
  );
}

function viewEntity() {
  inquirer.prompt(viewWhat).then((userView) => {
    const { view } = userView;
    switch (view) {
      case "View Departments":
        viewDepartments();
        break;
      case "View Roles":
        viewRoles();
        break;
      case "View Employees":
        viewEmployees();
        break;
    }
  });
}

// Update Functions
function test() {
  connection.query(`SELECT id, first_name, last_name from employee`, function (
    err,
    res
  ) {
    if (err) throw err;
    let employees = [];
    let employeeNames = [];
    for (let index = 0; index < res.length; index++) {
      employees.push(res[index]);
      let fullName = `${res[index].first_name} ${res[index].last_name}`
      employeeNames.push(fullName);
    }
    console.log(employees);
    console.log(employeeNames);
    test2(employees, employeeNames);
  });


}

function test2(employees, employeeNames) {
  const updateEmpRole = [
    {
      type: "list",
      choices: employeeNames,
      name: "roleUpd",
      message: "Which employee's role would you like to update?",
    },
  ];

  inquirer.prompt(updateEmpRole).then((response) => {
    console.log(response);
    const { roleUpd } = response;
    let name = roleUpd.split(" ");
    let lastName = name[1];
    let employeeID;

    for (let index = 0; index < employees.length; index++) {
      
      if (lastName == employees[index].last_name) {
        employeeID = employees[index].id;
      }
    }
    
  });
}

// Init Function
function init() {
  inquirer.prompt(initQs).then((userAction) => {
    const { action } = userAction;
    switch (action) {
      case "Add Department/Role/Employee":
        addEntity();
        break;
      case "View Departments/Roles/Employees":
        viewEntity();
        break;
      case "Update Employee Roles":
        test();
        break;
      case "EXIT":
        process.exit();
    }
  });
}

(module.exports = init),
  addEntity,
  addDepartment,
  addRole,
  getDepartments,
  connection;
