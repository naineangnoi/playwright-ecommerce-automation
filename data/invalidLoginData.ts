export const invalidLoginData = [
    { scenario: 'Invalid username and password',
        username: 'wrong_user', 
        password: 'wrong_password' 
    },
    { scenario: 'Invalid password', 
        username: 'standard_user', 
        password: 'wrong_password' 
    },
    { scenario: 'Unknown user', 
        username: 'unknown_user', 
        password: 'secret_sauce' 
    }
];