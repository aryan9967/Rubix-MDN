import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import cors from 'cors';
import {} from './DB/firebase.js';
import authRoutes from './routes/authRoute.js';
import adminRoute from './routes/adminRoute.js';
import userRoute from './routes/userRoute.js';
import path from 'path'

// configure env
dotenv.config();

// create an instance of express
const app = express();

// middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(path.resolve(), 'Frontend')));

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/user', userRoute);

// rest api
// app.get('/', (req, res) => {
//   try {
//     res.send('<h1>Welcome to MDN</h1>');
//   } catch (error) {
//     console.log(error);
//   }
// });

// PORT
const PORT = process.env.PORT || 8080;


// app.get('/CSS/index.css', function(req, res) {
// });

// app.get('/', function(req, res) {

//   res.sendFile(path.join(path.resolve()+'/Frontend/index.html'));
//   // res.sendFile(path.resolve() + "/" + "index.css");

// });

// route for serving HTML file
app.get('/', function (req, res) {
  res.sendFile('index.html');
});


// Listens
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`.cyan);
});
