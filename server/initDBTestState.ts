import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';
import { TodosService } from './src/todos/todos.service';
import { DataSource } from 'typeorm';

const serverPort = 'http://localhost:3000';

async function main() {
    try {
        await clearDB();
        await populateTestData();
        console.log("Test DB initialized");
    } catch (error) {
        console.error('Error initializing test DB state:', error);
    }
}

// async function post(url: string, body: any) {
//     const res = await fetch(`${serverPort}${url}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//     });

//     if (!res.ok) {
//         throw new Error(`Failed to POST ${url}: ${res.status} ${await res.text()}`);
//     }
//     return res.json();
// }

async function populateTestData() {
    const app = await NestFactory.createApplicationContext(AppModule); // load app without http server
    const userService = app.get(UsersService);
    const todoService = app.get(TodosService);
    try {
        const fred = await userService.create({ email: 'fred@todo.com', password: 'test123' });
        const george = await userService.create({ email: 'george@todo.com', password: 'nuggets25'} );

        await todoService.create({ title: 'Mow lawn' }, fred.id);
        await todoService.create({ title: 'Take out bins' }, fred.id);
        await todoService.create({ title: 'Water plants' }, fred.id);

        await todoService.create({ title: 'Book flight', description: 'evaluate options & book' }, george.id);
        await todoService.create({ title: 'Alice birthday' }, george.id);

    } catch (error) {
        console.error('Error initializing test DB state:', error);
    } finally {
        await app.close();
    }
}

async function clearDB() {
    const app = await NestFactory.createApplicationContext(AppModule); // load app without http server
    const dataSource = app.get(DataSource);
    try {
        await dataSource.synchronize(true); // drop & recreate tables
    } catch (error) {
        console.error('Error during clearing DB:', error);
    } finally {
        await app.close();
    }
}

main();
