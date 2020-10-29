INSERT INTO department (name)
VALUES ("Accounting");

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Research & Development");

INSERT INTO role (title, salary, department_id)
VALUES ("Accounting Team Lead", 75000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 55000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Director", 100000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Representative", 50000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Research Director", 125000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Research Assistant", 85000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Alex", "Smith", 1, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rachel", "Anderson", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Denise", "Williams", 3, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Steve", "Brown", 4, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Becky", "Ross", 5, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Lars", "Navarro", 6, 5);




