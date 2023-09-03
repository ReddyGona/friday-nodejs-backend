import express from 'express';
import cors from 'cors';
import { taskRouter } from './routes/taskRoutes';
import { errorHandler } from './middleware/errorHandler';
import { connectDb } from './config/dbConnection';
import { userRouter } from './routes/userRoutes';

// const { client } = require('./config/init_redis');
require('dotenv').config();

// client.connect();

connectDb();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        credentials: true
    })
);

app.use('/api/tasks', taskRouter);
app.use('/api/users', userRouter);
app.use(errorHandler);

//const server = http.createServer(app);

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}/`);
});
