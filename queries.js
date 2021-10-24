const inquirer = require("inquirer");

// const mainMenu = [
//     {
//         type: 'list',
//         message: 'What would you like to do?',
//         choices: [
//             'View All Employees', 
//             'Add Employee', 
//             'Update Employee Role', 
//             'View All Roles', 
//             'Add Role', 
//             'View All Departments', 
//             'Add Department', 
//             'Quit'],
//         name: 'choice'
//     }
// ];

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

    inquirer
        .prompt(questions).then(answer => {
            return answer.name;
        });
}

function queryAddRole(departmentsObj) {
    const departments =  [];
    departmentsObj.forEach(obj => {
        const department = obj.name[0].toUpperCase() + obj.name.substring(1);
        departments.push(department);
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
                filter(val) {
                    return val.toLowerCase();
                },
            name: 'department'
        }
    ];

    inquirer
        .prompt(questions).then(role => {
            return role;
        });
}

function queryAddEmployee(rolesObj, employeesObj) {
    const roles =  [];
    const employees = ['None'];
    rolesObj.forEach(obj => {
        const role = obj.name[0].toUpperCase() + obj.name.substring(1);
        roles.push(role);
    });
    employeesObj.forEach(obj => {
        const employee = obj.first_name + ' ' + obj.last_name;
        employees.push(employee);
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
                filter(val) {
                    return val.toLowerCase();
                },
            name: 'role'
        },
        {
            type: 'list',
            message: 'Select employee\'s manager',
            choices: employees,
            name: 'manager'
        }
    ];

    inquirer
        .prompt(questions).then(employee => {
            return employee;
        });
}

module.exports = { mainMenu, queryAddDepartment, queryAddEmployee }
