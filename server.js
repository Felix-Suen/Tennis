const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')

const app = express();

// connected database
connectDB();

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use(cors());
app.use('/api/game', require('./routes/api/game'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
