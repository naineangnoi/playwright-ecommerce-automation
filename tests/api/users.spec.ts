import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { UserApi } from '../../api/UserApi';
import type { User } from '../../types/User';
import { createTestUser} from '../../data/userFactory';

test.describe('API Tests', () => {

test('API-001: Get existing user', async ({ request }) => {
    
    const token = process.env.GOREST_TOKEN

    if (!token){
        throw new Error('GOREST_TOKEN is not defines');
    }

    const userApi = new UserApi(request, token

    )
    const response = await userApi.getUsers();

        expect(response.status()).toBe(200);

        const users = await response.json();
        expect(Array.isArray(users)).toBe(true);

        for (const user of users) {
            expect(typeof user.id).toBe('number');
            expect(user.name).toBeTruthy();
            expect(user.email).toContain('@');
            expect(['active', 'inactive']).toContain(user.status);
        }
    });

   
test('API-002: Get user by ID', async ({ request }) => {
    const token = process.env.GOREST_TOKEN;

    if (!token) {
        throw new Error('GOREST_TOKEN is not defined');
    }

    const userApi = new UserApi(request, token);

    const newUser = createTestUser();

    let userId: number | undefined;

    try {
        // Arrange: Create test user
        const createResponse = await userApi.createUser(newUser);
        expect(createResponse.status()).toBe(201);

        const createdUser = await createResponse.json();
        expect(typeof createdUser.id).toBe('number');

        userId = createdUser.id;

        // Act: Get user by ID
        const getResponse = await userApi.getUser(userId!);

        // Assert
        expect(getResponse.status()).toBe(200);

        const retrievedUser = await getResponse.json();

        expect(retrievedUser).toMatchObject({
            id: userId,
            name: newUser.name,
            email: newUser.email,
            status: newUser.status
        });

    } finally {
        // Cleanup
        if (userId !== undefined) {
            const deleteResponse = await userApi.deleteUser(userId);
            expect([204, 404]).toContain(deleteResponse.status());
        }
    }
});


    test('API-003: Get non-existing user', async ({ request }) => {

        const token = process.env.GOREST_TOKEN;

        if (!token) {
        throw new Error('GOREST_TOKEN is not defined');
        }

        const userApi = new UserApi(request, token);

        const nonExistingUserId = 999999;
        const response = await userApi.getUser(nonExistingUserId)
        expect(response.status()).toBe(404);

        const errorResponse = await response.json();
        expect(errorResponse.message).toBe('Resource not found');   
    });

    test('API-004: Create a new user', async ({ request }) => {

        const token = process.env.GOREST_TOKEN;

        if (!token) {
            throw new Error('GOREST_TOKEN is not defined in the environment variables.');
        }

        const userApi = new UserApi(request,token);

        const newUser = createTestUser();

        let userId: number | undefined;

        try {
        const response = await userApi.createUser(newUser);
        
        expect(response.status()).toBe(201);    

        const body = await response.json();
        userId = body.id;

        expect(typeof userId).toBe('number');
        expect(userId).toBeGreaterThan(0);
        expect(body.name).toBe(newUser.name);
        expect(body.email).toBe(newUser.email);
        expect(body.gender).toBe(newUser.gender);
        expect(body.status).toBe(newUser.status);

        console.log(`Created user with ID: ${userId}`);
    } finally {
        //Delete the created user to clean up
        if (userId !== undefined) {
            const deleteResponse = await userApi.deleteUser(userId);
            expect(deleteResponse.status()).toBe(204);
        }
    }
    });

    test('API-005: Verify user creation', async ({ request }) => {

        const token = process.env.GOREST_TOKEN;         

        if (!token) {
            throw new Error('GOREST_TOKEN is not defined in the environment variables.');
        }

        const userApi = new UserApi(request,token);

        const newUser = createTestUser();

        let userId: number | undefined;

        try {
        const createResponse = await userApi.createUser(newUser);

        expect(createResponse.status()).toBe(201);

        const createdUser = await createResponse.json();
        const createdUserId = createdUser.id;

        expect(createdUserId).toBeGreaterThan(0)
        userId = createdUserId;

        expect (typeof userId).toBe('number');

        const getResponse = await userApi.getUser(createdUserId);

        console.log('Created User ID:', createdUserId);
        console.log('GET URL:', getResponse.url());
        console.log('GET Status:', getResponse.status());
        console.log('GET Body:', await getResponse.text());

        expect(getResponse.status()).toBe(200);
        expect(typeof createdUserId).toBe('number');
        expect(createdUserId).toBeGreaterThan(0);

        const retrievedUser = await getResponse.json();

        expect(retrievedUser).toMatchObject({
            email: newUser.email,
            gender: newUser.gender,
            status: newUser.status
        });
        }finally{ 
        if (userId !== undefined) {
            const deleteResponse = await userApi.deleteUser(userId);
            expect(deleteResponse.status()).toBe(204);
        }
    }
});

test('API-006: Update user using Patch', async ({ request }) => {

    const token = process.env.GOREST_TOKEN;

    if (!token) {
        throw new Error('GOREST_TOKEN is not defined in the environment variables.');
    }

    const baseUrl = 'https://gorest.co.in/public/v2/users';

    const newUser = createTestUser();

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    let userId: number | undefined;

    try {
        // Step 1: POST - Create User
        const createResponse = await request.post(baseUrl, {
            headers: headers,
            data: newUser
        });

        expect(createResponse.status()).toBe(201);

        const createdUser = await createResponse.json();
        const createUserId: number = createdUser.id;

        expect(createUserId).toBeGreaterThan(0);
        userId = createdUser.id;

        expect(typeof userId).toBe('number');

        if (userId === undefined) {
            throw new Error('User ID is undefined after creating the user.');
        }

        // Step 2: PATCH - Update status
        const userApi = new UserApi(request, token)
        const patchResponse = await userApi.updateUser(
            createUserId,
            { status: 'inactive' }
        );

        expect(patchResponse.status()).toBe(200);

        const updatedUser = await patchResponse.json();
        expect(updatedUser).toMatchObject({
            id: userId,
            name: newUser.name,
            email: newUser.email,
            gender: newUser.gender,
            status: 'inactive'
        });

        // Step 3: GET - Verify Update
        const getResponse = await userApi.getUser(createUserId);

        expect(getResponse.status()).toBe(200);

        const retrievedUser = await getResponse.json();
        expect(retrievedUser).toMatchObject({
            id: userId,
            name: newUser.name,
            email: newUser.email,
            gender: newUser.gender,
            status: 'inactive'
        });
    } finally {
        // Cleanup: DELETE - Remove User
        if (userId !== undefined) {
            const userApi = new UserApi(request, token)
            const deleteResponse = await userApi.deleteUser(userId);

            expect(deleteResponse.status()).toBe(204);
        }
    }
});

test('API-007: Delete user and verify 404', async ({ request }) => {

    const token = process.env.GOREST_TOKEN;
    if (!token) {
        throw new Error('GOREST_TOKEN is not defined in the environment variables.');
    }

    const userApi = new UserApi(request, token);

    const baseUrl = 'https://gorest.co.in/public/v2/users';

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const newUser = createTestUser();

    let userId: number | undefined;
    let deleted = false;
    
    try {
        // Step 1: Create User
        const createUser = await userApi.createUser(newUser);

        expect(createUser.status()).toBe(201);

        const createdResponse = await createUser.json();
        const createUserId: number = createdResponse.id;

        expect(typeof createUserId).toBe('number');
        expect(createUserId).toBeGreaterThan(0);

        userId = createUserId;

        // Step 2: Delete User
        const deleteResponse = await request.delete(`${baseUrl}/${userId}`, {headers});

        expect(deleteResponse.status()).toBe(204);
        deleted = true;

        // Step 3: Verify Deletion
        const getResponse = await userApi.getUser(createUserId);
        expect(getResponse.status()).toBe(404);

        deleted = true;

        const errorResponse = await getResponse.json();
        expect(errorResponse.message).toBe('Resource not found');

    } finally {
        // Cleanup: Ensure user is deleted
        if (userId !== undefined && !deleted) {
            const deleteResponse = await request.delete(`${baseUrl}/${userId}`, {headers});
            expect([204, 404]).toContain(deleteResponse.status());
        }
    }
});         
}); 