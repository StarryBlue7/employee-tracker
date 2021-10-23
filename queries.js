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

module.exports = { mainMenu }
