const mysql = require('mysql2');
const consoleTable = require('console.table');
const { mainMenu } = require('./queries')

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employee_db'
    },
    console.log('Connected to the employee_db database.')
);

function view(choice) {
    let table;
    switch (choice) {
        case 'View All Employees':
            table = 'employee';
            break;
        case 'View All Roles':
            table = 'role';
            break;
        case 'View All Departments':
            table = 'department';
            break;
    }
    db.query(`SELECT * FROM ${table}`, (err, results) => {
        err ? console.error(err) : console.table(results);
    });
}

function getRoles() {
    db.query(`SELECT title FROM role`, (err, results) => {
        err ? console.error(err) : console.log(results);
    });
}

function getManagers() {
    db.query(`SELECT first_name, last_name FROM employee`, (err, results) => {
        err ? console.error(err) : console.log(results);
    });
}

function addEmployee(employee) {
    db.query(`INSERT INTO employee 
    (first_name, last_name, role_id, manager_id) 
    VALUES ("${employee.first_name}", "${employee.last_name}", ${employee.role_id}, ${employee.manager_id})`, 
    (err, results) => {
        err ? console.error(err) : console.log(`Added ${employee.first_name} ${employee.last_name} to employee database.`);
    });
}