const mysql = require('mysql2');
const consoleTable = require('console.table');
const { 
    mainMenu, 
    queryAddDepartment, 
    queryAddRole, 
    queryEmployee,
    chooseFromList 
} = require('./queries')

// Database connection
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employee_db'
    },
    console.log('Connected to the employee_db database.')
);

// View tables
function view(table, selection, join) {
    db.query(`SELECT ${selection || '*'} FROM ${table} ${join || ''}`, (err, results) => {
        err ? console.error(err) : console.table(results);
        main();
    });
}

// View employees by filter
async function viewBy(filter) {
    const employeesQuery = await getEmployees();
    if (filter === 'manager') {
        const manager = await chooseFromList('manager', employeesQuery);
        const manager_id = getID(employeesQuery, manager);
        db.query(`SELECT 
            employee.id AS ID, 
            employee.first_name AS "First Name", 
            employee.last_name AS "Last Name", 
            title AS Title, 
            name AS Department, 
            salary AS Salary
            FROM employee
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            INNER JOIN employee AS manager ON employee.manager_id = manager.id
            WHERE manager.id = ?`, 
            manager_id,
            (err, results) => {
                err ? console.error(err) : console.table(results);
                main();
            }
        );
    } else {
        const departmentsQuery = await getDepartments();
        const department = await chooseFromList('department', departmentsQuery);
        const department_id = getID(departmentsQuery, department);
        db.query(`SELECT 
            employee.id AS ID, 
            employee.first_name AS "First Name", 
            employee.last_name AS "Last Name", 
            title AS Title, 
            CONCAT_WS(\' \', manager.first_name, manager.last_name) AS Manager, 
            salary AS Salary
            FROM employee
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN employee AS manager ON employee.manager_id = manager.id
            INNER JOIN department ON role.department_id = department.id
            WHERE department_id = ?`, 
            department_id,
            (err, results) => {
                err ? console.error(err) : console.table(results);
                main();
            }
        );
    };
}

// Get id of item from query data
function getID(queryResult, item) {
    return queryResult[0].filter(obj => obj.name === item.name)[0].id;
}

// Queries for department, role, and employee tables
function getDepartments() {
    return db.promise().query(`SELECT id, name FROM department`);
}

function getRoles() {
    return db.promise().query(`SELECT id, title AS name FROM role`);
}

function getEmployees() {
    return db.promise().query(`SELECT id, CONCAT_WS(' ', first_name, last_name) AS name FROM employee`);
}

// Add or modify employee
async function setEmployee(isNew) {
    const rolesQuery = await getRoles();
    const employeesQuery = await getEmployees();
    let employee;
    let currentEmployee;
    if (isNew) {
        employee = await queryEmployee(rolesQuery, employeesQuery, true);
    } else {
        currentEmployee = await chooseFromList('employee', employeesQuery);
        employee = await queryEmployee(rolesQuery, employeesQuery, false, currentEmployee);
    }
    const role_id = rolesQuery[0].filter(role => role.name === employee.role)[0].id;
    const manager = employeesQuery[0].filter(manager => manager.name === employee.manager);
    const manager_id = manager.length ? manager[0].id : null;

    let sqlString;
    let sqlParams;
    let message;
    if (isNew) {
        sqlString = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        sqlParams = [employee.first_name, employee.last_name, role_id, manager_id];
        message = `\nAdded ${employee.first_name} ${employee.last_name} to employee database.\n`;
    } else {
        const employee_id = getID(employeesQuery, currentEmployee);
        sqlString = `UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?`;
        sqlParams = [role_id, manager_id, employee_id];
        message = `\nUpdated ${currentEmployee.name} info in employee database.\n`;
    }

    db.query(sqlString, sqlParams, (err, results) => {
        err ? console.error(err) : console.log(message);
        return main();
    });
}

// Add role
async function addRole() {
    const departments = await getDepartments();
    const role = await queryAddRole(departments);
    const department_id = departments[0].filter(department => department.name === role.department)[0].id;
    db.query(`INSERT INTO role (title, salary, department_id) 
        VALUES (?, ?, ?)`, [role.title, role.salary, department_id], 
        (err, results) => {
            err ? console.error(err) : console.log(`\nAdded ${role.title} to employee database roles.\n`);
            return main();
        }
    );
}

// Add department
async function addDepartment() {
    const department = await queryAddDepartment();
    db.query(`INSERT INTO department (name) VALUES (?)`, department.name, (err, results) => {
        err ? console.error(err) : console.log(`\nAdded ${department.name} to employee database departments.\n`);
        return main();
    });
}

// Delete from tables
async function deleteFrom(table) {
    let list;
    switch (table) {
        case 'employee':
            list = await getEmployees();
            break;
        case 'role':
            list = await getRoles();
            break;
        case 'department':
            list = await getDepartments();
            break;
    }
    const selection = await chooseFromList(table, list);
    deleteRow(table, selection, list);
}

// Delete row of the selected item
function deleteRow(table, item, itemList) {
    const item_id = itemList[0].filter(obj => obj.name === item.name)[0].id;
    db.query(`DELETE FROM ${table} WHERE id = ?`, item_id, (err, result) => {
        err ? console.error(err) : console.log(`\n${item.name} deleted!\n`)
        return main();
    });
};

// Main menu function
async function main() {
    const answer = await mainMenu();
    switch (answer.choice) {
        case 'View All Employees':
            view(
                'employee', 
                'employee.id AS ID, employee.first_name AS "First Name", employee.last_name AS "Last Name", title AS Title, name AS Department, salary AS Salary, CONCAT_WS(\' \', manager.first_name, manager.last_name) AS Manager', 
                'LEFT JOIN role ON employee.role_id = role.id ' + 
                'LEFT JOIN department ON role.department_id = department.id ' +
                'LEFT JOIN employee AS manager ON employee.manager_id = manager.id'
            );
            break;
        case 'View All Roles':
            view(
                'role', 
                'title AS Role, salary AS Salary, name AS Department', 
                'LEFT JOIN department ON role.department_id = department.id '
            );
            break;
        case 'View All Departments':
            view(
                'department', 
                'name AS Departments'
            );
            break;
        case 'View Employees by Manager':
            viewBy('manager');
            break;
        case 'View Employees by Department':
            viewBy('department');
            break;
        case 'Add Employee':
            setEmployee(true);
            break;
        case 'Update Employee':
            setEmployee(false);
            break;
        case 'Add Role':
            addRole();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Delete Employee':
            deleteFrom('employee');
            break;
        case 'Delete Role':
            deleteFrom('role');
            break;
        case 'Delete Department':
            deleteFrom('department');
            break;
        default:
            console.log(`\nGoodbye.\n`);
            process.exit();
    }
}

// ASCII title card
function asciiTitle() {
    console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
‖   ______                 _                  ___                              ‖
‖  (  /   \`               //                 ( / \\     _/_      /              ‖
‖    /--   _ _ _    ,_   // __ __  , _  _     /  /__,  /  __,  /  __,  (   _   ‖
‖  (/____// / / /__/|_)_(/_(_)/ (_/_(/_(/_  (/\\_/(_/(_(__(_/(_/_)(_/(_/_)_(/_  ‖
‖                  /|            /                                             ‖
╚═════════════════(/════════════'══════════════════════════════════════════════╝
`);
}

// Run on start
function init() {
    asciiTitle();
    main();
}

init();