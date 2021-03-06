const inquirer = require("inquirer");

// Main menu prompt
function mainMenu() {
    const menu = [
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees', 
                'View Employees by Manager',
                'View Employees by Department',
                'Add Employee', 
                'Update Employee', 
                'View All Roles', 
                'Add Role', 
                'View All Departments', 
                'Add Department', 
                'Delete Employee',
                'Delete Role',
                'Delete Department',
                'Quit'],
            name: 'choice'
        }
    ];

    return inquirer.prompt(menu)
}

// Prompt for adding department
function queryAddDepartment() {
    const questions = [
        {
            message: 'Enter department name: ',
            name: 'name'
        }
    ];

    return inquirer.prompt(questions)
}

// Prompt for adding role
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
            message: 'Select role\'s department: ',
            choices: departments,
            name: 'department'
        }
    ];

    return inquirer.prompt(questions)
}

// Prompt for adding/modifying employee
function queryEmployee(rolesQuery, employeesQuery, isNew, employee) {
    const roleList = [];
    const employeeList = ['None'];
    
    rolesQuery[0].forEach(role => {
        roleList.push(role.name);
    });
    employeesQuery[0].forEach(obj => {
        employeeList.push(obj.name);
    });

    let managerList;
    if (!isNew) {
        managerList = employeeList.filter(name => name !== employee.name)
    }

    const newQuestions = [
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
            choices: roleList,
            name: 'role'
        },
        {
            type: 'list',
            message: 'Select employee\'s manager: ',
            choices: employeeList,
            name: 'manager'
        }
    ];

    const updateQuestions = [
        {
            type: 'list',
            message: 'Select employee\'s role: ',
            choices: roleList,
            name: 'role'
        },
        {
            type: 'list',
            message: 'Select employee\'s manager: ',
            choices: managerList,
            name: 'manager'
        }
    ];

    return isNew ? inquirer.prompt(newQuestions) : inquirer.prompt(updateQuestions);
}

// Generate prompt with list from database query
function chooseFromList(type, queryResult) {
    const list = [];
    queryResult[0].forEach(item => {
        list.push(item.name);
    });

    const questions = [
        {
            type: 'list',
            message: `Select ${type}:`,
            choices: list,
            name: 'name'
        }
    ];

    return inquirer.prompt(questions);
}

module.exports = { mainMenu, queryAddDepartment, queryAddRole, queryEmployee, chooseFromList }
