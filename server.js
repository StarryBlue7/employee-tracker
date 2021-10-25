const mysql = require('mysql2');
const consoleTable = require('console.table');
const { mainMenu, queryAddDepartment, queryAddRole, queryEmployee, chooseEmployee, chooseDepartment } = require('./queries')

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

function viewBy(filter) {
    getEmployees().then(employeesQuery => {
        if (filter === 'manager') {
            chooseEmployee(employeesQuery).then(manager => {
                const manager_id = employeesQuery[0].filter(employee => employee.name === manager.name)[0].id;
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
            });
        } else {
            getDepartments().then(departmentsQuery => {
                chooseDepartment(departmentsQuery).then(department => {
                    const department_id = departmentsQuery[0].filter(obj => obj.name === department.name)[0].id;
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
                });
            });
        };
    });
}

function getDepartments() {
    return db.promise().query(`SELECT id, name FROM department`);
}

function getRoles() {
    return db.promise().query(`SELECT id, title FROM role`);
}

function getEmployees() {
    return db.promise().query(`SELECT id, CONCAT_WS(' ', first_name, last_name) AS name FROM employee`);
}

function setEmployee(isNew) {
    getRoles().then(rolesQuery => {
        getEmployees().then(employeesQuery => {
            if (isNew) {
                queryEmployee(rolesQuery, employeesQuery, true).then(employee => {
                    const role_id = rolesQuery[0].filter(role => role.title === employee.role)[0].id;
                    const manager = employeesQuery[0].filter(manager => manager.name === employee.manager);
                    const manager_id = manager.length ? manager[0].id : null;

                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                        VALUES (?, ?, ?, ?)`, [employee.first_name, employee.last_name, role_id, manager_id], 
                        (err, results) => {
                            err ? console.error(err) : console.log(`\nAdded ${employee.first_name} ${employee.last_name} to employee database.\n`);
                            return main();
                        }
                    );
                });
            } else {
                chooseEmployee(employeesQuery).then(currentEmployee => {
                    queryEmployee(rolesQuery, employeesQuery, false, currentEmployee).then(employee => {
                        const employee_id = employeesQuery[0].filter(obj => obj.name === currentEmployee.name)[0].id;
                        const role_id = rolesQuery[0].filter(role => role.title === employee.role)[0].id;
                        const manager = employeesQuery[0].filter(manager => manager.name === employee.manager);
                        const manager_id = manager.length ? manager[0].id : null;

                        db.query(`UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?`, 
                            [role_id, manager_id, employee_id], 
                            (err, results) => {
                                err ? console.error(err) : console.log(`\nUpdated ${currentEmployee.name} info in employee database.\n`);
                                return main();
                            }
                        );
                    });
                });
            }
        });
    }); 
}

function addRole() {
    getDepartments().then(departments => {
        queryAddRole(departments).then(role => {
            const department_id = departments[0].filter(department => department.name === role.department)[0].id;
            db.query(`INSERT INTO role (title, salary, department_id) 
                VALUES (?, ?, ?)`, [role.title, role.salary, department_id], 
                (err, results) => {
                    err ? console.error(err) : console.log(`\nAdded ${role.title} to employee database roles.\n`);
                    return main();
                }
            );
        });    
    });
}

function addDepartment() {
    queryAddDepartment().then(department => {
        db.query(`INSERT INTO department (name) VALUES (?)`, department.name, (err, results) => {
                err ? console.error(err) : console.log(`\nAdded ${department.name} to employee database departments.\n`);
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
                deleteRow('employee');
                break;
            case 'Delete Role':
                deleteRow('role');
                break;
            case 'Delete Department':
                deleteRow('department');
                break;
            default:
                console.log(`\nGoodbye.\n`);
                process.exit();
        }
    }).catch(err => console.error(err));
}

function asciiTitle() {
    console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
‖   ______                 _                  ___                              ‖
‖  (  /                   //                 ( / \\     _/_      /              ‖
‖    /--   _ _ _    ,_   // __ __  , _  _     /  /__,  /  __,  /  __,  (   _   ‖
‖  (/____// / / /__/|_)_(/_(_)/ (_/_(/_(/_  (/\\_/(_/(_(__(_/(_/_)(_/(_/_)_(/_  ‖
‖                  /|            /                                             ‖
╚═════════════════(/════════════'══════════════════════════════════════════════╝
`);
}

function init() {
    asciiTitle();
    main();
}

init();