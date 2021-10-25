const inquirer = require("inquirer");

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
            message: 'Select role\'s department: ',
            choices: departments,
            name: 'department'
        }
    ];

    return inquirer.prompt(questions)
}

function queryEmployee(rolesQuery, employeesQuery, isNew, employee) {
    const roleList = [];
    const employeeList = ['None'];
    
    rolesQuery[0].forEach(role => {
        roleList.push(role.title);
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

function chooseEmployee(employeesQuery) {
    const employeeList = [];
    employeesQuery[0].forEach(employee => {
        employeeList.push(employee.name);
    });

    const questions = [
        {
            type: 'list',
            message: 'Select employee:',
            choices: employeeList,
            name: 'name'
        }
    ];

    return inquirer.prompt(questions);
}

function chooseDepartment(departmentsQuery) {
    const departmentList = [];
    departmentsQuery[0].forEach(department => {
        departmentList.push(department.name);
    });

    const questions = [
        {
            type: 'list',
            message: 'Select department:',
            choices: departmentList,
            name: 'name'
        }
    ];

    return inquirer.prompt(questions);
}

module.exports = { mainMenu, queryAddDepartment, queryAddRole, queryEmployee, chooseEmployee, chooseDepartment }
