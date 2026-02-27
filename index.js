
const express = require('express');
const app = express();
app.use(express.json())


const cors = require('cors');
require('dotenv').config();
const FRONTEND_URL = process.env.FRONTEND_URL

const allowedOrigins = [
  'https://techmog-forms-fe.vercel.app',
  'http://localhost:3000',
  FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const userRoutes = require('./routes/userRoutes')
app.use('/user', userRoutes);

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



