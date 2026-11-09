import type { User } from '../types/User';

export function createTestUser(): Omit<User, 'id'> {
    return {
        name: 'Automation Test User',
        email: `test${Date.now()}_${Math.random().toString(36).slice(2,8)}@example.com`,
        gender: 'male',
        status: 'active'
    }
}