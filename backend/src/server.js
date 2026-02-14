import express from 'express';
import dotenv from 'dotenv';
import AuthRouter from './routes/auth.route.js'
import MessageRouter from './routes/message.route.js'
import path from 'path';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser'

dotenv.config();

const PORT = process.env.PORT || 3000;


const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', AuthRouter);
app.use('/api/message', MessageRouter);


// deployment setup
if (process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get("/*path", (_, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
    connectDB();
})