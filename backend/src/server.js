import express from 'express';
import dotenv from 'dotenv';
import AuthRouter from './routes/auth.route.js'

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use('/api/auth',AuthRouter);


app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`))