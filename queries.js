const inquirer = require("inquirer");

function mainMenu() {
    const menu = [
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
            name: 'choice'
        }
    ];

    inquirer
        .prompt(menu).then(answer => {
            return answer.choice;
        });
}

function queryDepartment() {
    const questions = [
        {
            message: 'Enter department name: ',
            name: 'department'
        }
    ];

    inquirer
        .prompt(questions).then(answer => {
            return answer.choice;
        });
}

function queryRole(departmentsObj) {
    const departments =  [];
    departmentsObj.forEach(obj => {
        const department = obj.name[0].toUpperCase() + obj.name.substring(1);
        departments.push(department);
    });

    const questions = [
        {
            message: 'Enter role name: ',
            name: 'role'
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
        .prompt(questions).then(answer => {
            return answer.choice;
        });
}

module.exports = { mainMenu }
