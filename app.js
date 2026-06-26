import 'dotenv/config';
import express from 'express';
import cors from 'cors';

//routes import
import authRoutes from './src/routes/auth.routes.js';

const app = express();

app.use(cors());
app.use(express.json());    

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({message: 'backend server is up and running!'});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

