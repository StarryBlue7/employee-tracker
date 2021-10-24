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
            table = 'employees';
            break;
        case 'View All Roles':
            table = 'roles';
            break;
        case 'View All Departments':
            table = 'departments';
            break;
    }
    db.query(`SELECT * FROM ${table}`, (err, results) => {
        err ? console.error(err) : console.table(results);
    });
}

view('View All Employees');