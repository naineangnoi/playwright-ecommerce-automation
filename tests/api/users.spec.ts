import { test, expect } from '../../fixtures/apiFixture';
import 'dotenv/config';
import { createTestUser} from '../../data/userFactory';

test.describe('API Tests', () => {

test('API-001: Get existing user', async ({ userApi }) => {

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


test('API-002: Get user by ID', async ({ userApi }) => {

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


    test('API-003: Get non-existing user', async ({ userApi }) => {

        const nonExistingUserId = 999999;
        const response = await userApi.getUser(nonExistingUserId)
        expect(response.status()).toBe(404);

        const errorResponse = await response.json();
        expect(errorResponse.message).toBe('Resource not found');
    });

    test('API-004: Create a new user', async ({ userApi }) => {

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

    test('API-005: Verify user creation', async ({ userApi }) => {

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

test('API-006: Update user using Patch', async ({ userApi }) => {

    let userId: number | undefined;

    try {
        // Step 1: POST - Create User
        const newUser = createTestUser();
        const createResponse = await userApi.createUser(newUser);

        expect(createResponse.status()).toBe(201);

        const createdUser = await createResponse.json();
        userId= createdUser.id;

        expect(typeof userId).toBe('number');
        expect(userId).toBeGreaterThan(0);
        userId = createdUser.id;

        expect(typeof userId).toBe('number');

        if (userId === undefined) {
            throw new Error('User ID is undefined after creating the user.');
        }

        // Step 2: PATCH - Update status
        const patchResponse = await userApi.updateUser(
            userId,
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
        const getResponse = await userApi.getUser(userId);

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
            const deleteResponse = await userApi.deleteUser(userId);

            expect(deleteResponse.status()).toBe(204);
        }
    }
});

test('API-007: Delete user and verify 404', async ({ userApi }) => {

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
        const deleteResponse = await userApi.deleteUser(userId);

        expect(deleteResponse.status()).toBe(204);
        deleted = true;

        // Step 3: Verify Deletion
        const getResponse = await userApi.getUser(userId);
        expect(getResponse.status()).toBe(404);

        const errorResponse = await getResponse.json();
        expect(errorResponse.message).toBe('Resource not found');

    } finally {
        // Cleanup: Ensure user is deleted
        if (userId !== undefined && !deleted) {
            const deleteResponse = await userApi.deleteUser(userId)
            expect([204, 404]).toContain(deleteResponse.status());
        }
    }
});
});