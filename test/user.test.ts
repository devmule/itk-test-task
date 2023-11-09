import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import * as Hapi from "@hapi/hapi";
import { getServerInjectOptions, Test, } from "./utils";
import {randomCredentials, randomName,} from "./utils/creds";

describe('User', () => {
    let server: Hapi.Server;
    const credentials = randomCredentials();
    let access: string;
    // let refresh: string;

    beforeAll(async () => {
        server = await Test.start();

        // create few users
        await server.inject(getServerInjectOptions('/api/auth/registration', 'POST', null, randomCredentials()),);
        await server.inject(getServerInjectOptions('/api/auth/registration', 'POST', null, randomCredentials()),);

        await server.inject(getServerInjectOptions('/api/auth/registration', 'POST', null, credentials),);
        const res: any = await server.inject(getServerInjectOptions('/api/auth/login', 'POST', null, {
            login: credentials.email,
            password: credentials.password,
        }),);
        access = res.result.result.access;
        // refresh = res.result.result.refresh;
    });

    afterAll(async () => {
        await server.stop();
    });

    it('Search for users', async () => {
        const res: any = await server.inject(
            getServerInjectOptions('/api/user/search', 'POST', access, {}),
        );
        expect(res.statusCode).toEqual(200);
        expect(res.result.ok).toBeTruthy();
        expect(res.result.result).toBeDefined();
        expect(res.result.result.count).toBeGreaterThanOrEqual(3);
        expect(res.result.result.rows).toBeInstanceOf(Array);
        expect(res.result.result.rows[0]).toBeDefined();
    });

    it('Search by email', async () => {
        const res: any = await server.inject(
            getServerInjectOptions('/api/user/search', 'POST', access, {
                email: credentials.email,
            }),
        );
        expect(res.statusCode).toEqual(200);
        expect(res.result.ok).toBeTruthy();
        expect(res.result.result).toBeDefined();
        expect(res.result.result.count).toEqual(1);
        expect(res.result.result.rows[0].email).toEqual(credentials.email);
    });

    it('Get by id', async () => {
        const users: any = await server.inject(
            getServerInjectOptions('/api/user/search', 'POST', access, {}),
        );
        expect(users.statusCode).toEqual(200);
        expect(users.result?.result?.rows?.length).toBeGreaterThanOrEqual(1);
        const user = users.result.result.rows[0];
        expect(typeof user?.id).toEqual("string")

        const receivedUser: any = await server.inject(
            getServerInjectOptions(`/api/user/${user.id}`, 'GET', access, {}),
        );
        expect(receivedUser.statusCode).toEqual(200);
        expect(receivedUser.result.ok).toBeTruthy();
        expect(typeof receivedUser.result.result?.id).toEqual("string");
        expect(receivedUser.result.result.id).toEqual(user.id);
    });

    it('Update name', async () => {
        const users: any = await server.inject(
            getServerInjectOptions('/api/user/search', 'POST', access, {}),
        );
        expect(users.statusCode).toEqual(200);
        expect(users.result?.result?.rows?.length).toBeGreaterThanOrEqual(1);
        const user = users.result.result.rows[0];
        expect(typeof user?.id).toEqual("string")

        const newName = {
            firstName: randomName(),
            lastName: randomName(),
        };
        const updatedUser: any = await server.inject(
            getServerInjectOptions(`/api/user/${user.id}`, 'PATCH', access, newName),
        );
        expect(updatedUser.statusCode).toEqual(200);
        expect(updatedUser.result.ok).toBeTruthy();
        expect(updatedUser.result.result.firstName).toEqual(newName.firstName);
        expect(updatedUser.result.result.lastName).toEqual(newName.lastName);
    });

    it('Get last month new users', async () => {
        const result: any = await server.inject(
            getServerInjectOptions('/api/user/statistics', 'GET', access, {}),
        );
        expect(result.statusCode).toEqual(200);
        expect(result.result.ok).toBeTruthy();
        expect(typeof result.result.result).toEqual("number");
    });

});