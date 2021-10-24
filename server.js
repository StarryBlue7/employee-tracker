const util = require('util');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const { mainMenu, queryAddDepartment, queryAddEmployee } = require('./queries')

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employee_db'
    },
    console.log('Connected to the employee_db database.')
);

function view(table) {
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

function main() {
    mainMenu().then(answer => {
        switch (answer.choice) {
            case 'View All Employees':
                view('employee');
                break;
            case 'View All Roles':
                view('role');
                break;
            case 'View All Departments':
                view('department');
                break;
            case 'Add Employee':

                break;
            case 'Update Employee Role':

                break;
            case 'Add Role':

                break;
            case 'Add Department':

                break;
            default:
                console.log('Goodbye.');
        }
    }).catch(err => console.error(err));
}

main();