
const express = require('express');
const app = express();
app.use(express.json())

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cors = require('cors');
require('dotenv').config();
const FRONTEND_URL = process.env.FRONTEND_URL
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const userRoutes = require('./routes/userRoutes')
app.use('/api/user', userRoutes);

const mongoose  = require('mongoose');
const PORT = process.env.PORT || 3001;
start = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log(mongoose.connection.name)
  console.log(FRONTEND_URL)

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

start()



