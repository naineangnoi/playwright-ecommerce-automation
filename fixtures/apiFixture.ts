import { test as base, expect} from '@playwright/test';
import { UserApi } from '../api/UserApi';
import 'dotenv/config';
import { error } from 'node:console';

type ApiFixture = { userApi: UserApi};

export const test=base.extend<ApiFixture>({
    userApi: async( {request}, use) => {
        const token = process.env.GOREST_TOKEN;

        if(!token) {
            throw new Error('GOREST_TOKEN is not defined');
        }

        const userApi = new UserApi (request, token);
        await use(userApi);
    }
}

);

export { expect};
