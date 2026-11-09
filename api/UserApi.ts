import { APIRequestContext, APIResponse } from '@playwright/test';
import { promises } from 'node:dns';

export class UserApi {
    private readonly baseUrl =
        'https://gorest.co.in/public/v2/users';

    constructor(
        private readonly request: APIRequestContext,
        private readonly token: string
    ) {}

    async createUser(userData: object): Promise<APIResponse> {
        return this.request.post(this.baseUrl, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            data: userData
        });
    }

    
    async deleteUser(userId: number): Promise<APIResponse> {
        return this.request.delete(
            `${this.baseUrl}/${userId}`,
             {
                headers: {
                    Authorization: `Bearer ${this.token}`
                        }
            }
        );
    }

    async updateUser(
        userId: number,
        updateData: object
    ): Promise<APIResponse> {
        return this.request.put(`${this.baseUrl}/${userId}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            data: updateData
        });
    }

    async getUser(userId: number): Promise<APIResponse> {
        return this.request.get(`${this.baseUrl}/${userId}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
    }

    async getUsers(): Promise<APIResponse> {
        return this.request.get(this.baseUrl, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
    }
}
