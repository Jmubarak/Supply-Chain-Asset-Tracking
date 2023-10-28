import { AppDataSource } from "./data-source";
import "reflect-metadata";
import app from './app';

AppDataSource.initialize().then(async connection => {
    console.log("Connection initialized successfully.");

    // Synchronize the database with your entities
    await connection.synchronize();

    console.log("Database synchrMySecurePassword123onized successfully.");

    app.listen(3000, () => console.log('server running on port 8080'));
}).catch(error => console.log(error));
