import 'dotenv/config';
import { connectDB } from './db/db.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
.then(() => app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}))
.catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
});

