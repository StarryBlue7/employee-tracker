const mysql = require('mysql2');
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

function view(table, selection, join) {
    db.query(`SELECT ${selection || '*'} FROM ${table} ${join || ''}`, (err, results) => {
        err ? console.error(err) : console.table(results);
        main();
    });
}

function getRoles() {
    db.query(`SELECT title FROM role`, (err, results) => {
        err ? console.error(err) : console.log(results);
    });
}

function getManagers() {
    db.query(`SELECT id, CONCAT_WS(' ', first_name, last_name) AS name FROM employee`, (err, results) => {
        err ? console.error(err) : console.log(results);
    });
}

function addEmployee(employee) {
    db.query(`INSERT INTO employee 
        (first_name, last_name, role_id, manager_id) 
        VALUES ("${employee.first_name}", "${employee.last_name}", ${employee.role_id}, ${employee.manager_id})`, 
        (err, results) => {
            err ? console.error(err) : console.log(`Added ${employee.first_name} ${employee.last_name} to employee database.`);
            main();
    });
}

function addRole(role) {
    queryAddRole().then(role => {
        
    })
    db.query(`INSERT INTO role (title, salary, department_id) 
        VALUES (?, ?, ?)`, [role.title, role.salary, department_id.id], 
        (err, results) => {
            err ? console.error(err) : console.log(`Added ${employee.first_name} ${employee.last_name} to employee database.`);
            return main();
    });
}

function addDepartment() {
    queryAddDepartment().then(department => {
        db.query(`INSERT INTO department (name) VALUES (?)`, department.name, (err, results) => {
                err ? console.error(err) : console.log(`Added ${department.name} to database.`);
                return main();
            });
    });
}

function main() {
    mainMenu().then(answer => {
        switch (answer.choice) {
            case 'View All Employees':
                view(
                    'employee', 
                    'employee.id AS ID, employee.first_name AS "First Name", employee.last_name AS "Last Name", title AS Title, name AS Department, salary AS Salary, CONCAT_WS(\' \', manager.first_name, manager.last_name) AS Manager', 
                    'LEFT JOIN role ON employee.role_id = role.id ' + 
                    'LEFT JOIN department ON role.department_id = department.id ' +
                    'LEFT JOIN employee AS manager ON employee.manager_id = manager.id');
                break;
            case 'View All Roles':
                view(
                    'role', 
                    'title AS Role, salary AS Salary, name AS Department', 
                    'LEFT JOIN department ON role.department_id = department.id '
                );
                break;
            case 'View All Departments':
                view('department', 'name AS Departments');
                break;
            case 'Add Employee':

                break;
            case 'Update Employee Role':

                break;
            case 'Add Role':

                break;
            case 'Add Department':
                addDepartment();
                break;
            default:
                console.log(`\nGoodbye.\n`);
                process.exit();
        }
    }).catch(err => console.error(err));
}

function init() {
    // ascii();
    main();
}

init ();