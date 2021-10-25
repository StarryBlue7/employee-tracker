const inquirer = require("inquirer");

function mainMenu() {
    const menu = [
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees', 
                'Add Employee', 
                'Update Employee Role', 
                'View All Roles', 
                'Add Role', 
                'View All Departments', 
                'Add Department', 
                'Quit'],
            name: 'choice'
        }
    ];

    return inquirer.prompt(menu)
}

function queryAddDepartment() {
    const questions = [
        {
            message: 'Enter department name: ',
            name: 'name'
        }
    ];

    return inquirer.prompt(questions)
}

function queryAddRole(departmentsQuery) {
    const departments = [];
    departmentsQuery[0].forEach(obj => {
        departments.push(obj.name);
    });

    const questions = [
        {
            message: 'Enter role name: ',
            name: 'title'
        },
        {
            message: 'Enter role salary: ',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'Select role\'s department',
            choices: departments,
            name: 'department'
        }
    ];

    return inquirer.prompt(questions)
}

function queryAddEmployee(rolesQuery, employeesQuery) {
    const roles =  [];
    const employees = ['None'];
    rolesQuery[0].forEach(obj => {
        roles.push(obj.title);
    });
    employeesQuery[0].forEach(obj => {
        employees.push(obj.name);
    });

    const questions = [
        {
            message: 'Enter employee\'s first name: ',
            name: 'first_name'
        },
        {
            message: 'Enter employee\'s last name: ',
            name: 'last_name'
        },
        {
            type: 'list',
            message: 'Select employee\'s role: ',
            choices: roles,
            name: 'role'
        },
        {
            type: 'list',
            message: 'Select employee\'s manager',
            choices: employees,
            filter(val) {
                return val === 'None' ? NULL : val;
            },
            name: 'manager'
        }
    ];

    return inquirer.prompt(questions);
}

module.exports = { mainMenu, queryAddDepartment, queryAddRole, queryAddEmployee }
