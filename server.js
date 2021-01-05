const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const app = express();

// connected database
connectDB();

// Define Routes
app.use(cors());
app.use('/api/game', require('./routes/api/game'));

// Serve production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
