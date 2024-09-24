const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { google } = require('googleapis');
const swaggerJSDoc= require('swagger-jsdoc');
const swaggerUi= require('swagger-ui-express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));
const  options = {
  definition: {
    openapi:'3.0.0',
    info: {
      title: 'GreenerTn API',
      version: '1.0.0',
     
      },
      servers: [
        {url: 'http://localhost:3000/' }] 
    
    },
    apis: ['app.js']
  }
   

const swaggerSpec= swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Define your secret key
const SECRET_KEY = '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';

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/GreenerTn', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: false,  
});



mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.use(bodyParser.json());

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true }, // Ensure unique email addresses
  password: String,
  confirmationCode: String,
  username: { type: String, unique: true }, // Add a unique constraint for the username
  fullName: String,
  isVerified: Boolean, //  field to track verification status
});

const User = mongoose.model('User', userSchema);

// Vehicle Schema
const vehicleSchema = new mongoose.Schema({
  brand: String,
  model: String,
  yearsInUsage: Number,
  uniqueId: String,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Journey Schema
const journeySchema = new mongoose.Schema({
  userId: String,
  vehicleId: String,
  distance: Number,
  date: String,
  carbonEmission: Number,
});
const Journey = mongoose.model('Journey', journeySchema);

const OAuth2 = google.auth.OAuth2;


const oauth2Client = new OAuth2(
  '730718835488-qd15q4b07s12h28tb8jp9anb29p1m860.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground' // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: '1//04LknF299apqCCgYIARAAGAQSNwF-L9Ir9J6Y-Vv0SYbKMAkJEqivGtMd7ug4WfRNeRTx69Om5MSs_20FuHjE4G1ilPzIxfLo14Q',
});


//Function to send confirmation email
// Function to send confirmation email
const sendConfirmationEmail = async (to, confirmationCode) => {
  const accessToken = oauth2Client.getAccessToken();
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    auth: {
      user: 'metaloniac@gmail.com',
      pass: 'pdru wgpk fggg jncz'
    }
  });

  const confirmationUrl = `http://localhost:3000/confirm/${confirmationCode}`;

  const mailOptions = {
    from: 'metaloniac@gmail.com',
    to: to,
    subject: 'Confirmation Email for GreenerTn',
    text: `Thank you for signing up! Please click the following link to confirm your account: ${confirmationUrl}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) reject(err);
      resolve(info);
    });
  });
};
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user
 *     description: Endpoint to sign up and issue JWT token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully. Check your email for confirmation.
 *         content:
 *           application/json:
 *             example:
 *               message: User created successfully. Check your email for confirmation.
 *               userId: <user_id>
 *               email: <user_email>
 *               username: <user_username>
 *               fullName: <user_fullName>
 *               token: <user_token>
 *       400:
 *         description: Error creating user
 *         content:
 *           application/json:
 *             example:
 *               error: Error creating user
 */
// Signup and issue JWT token
app.post('/signup', async (req, res) => {
  try {
    const { email, password, username, fullName } = req.body;
    console.log({ email, password, username, fullName } )
    // Check if the email or username is already registered
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    console.log(existingUser)
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate confirmation code
    const confirmationCode = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1d' });

    // Save user with hashed password and confirmation code
    const newUser = new User({ email, password: hashedPassword, confirmationCode, username, fullName });

    try {
      await newUser.save();
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      return res.status(500).json({ error: 'Error creating user' });
    }

    // Send confirmation email
  await sendConfirmationEmail(newUser.email, confirmationCode);

   ;
    // Issue JWT token
    const token = jwt.sign({ email: newUser.email }, SECRET_KEY, { expiresIn: '1d' });

    // Customize the response with additional information
    res.status(201).json({
      message: 'User created successfully. Check your email for confirmation.',
      userId: newUser._id,
      email: newUser.email,
      username: newUser.username,
      fullName: newUser.fullName,
      token,
    });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(400).json({ error: error.message });
  }
});



/**
 * @swagger
 * /confirm:
 *   post:
 *     summary: Confirm user account
 *     description: Endpoint to confirm user account
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirmationCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account confirmed successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: Account confirmed successfully.
 *       400:
 *         description: Invalid token.
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid token.
 */


// Confirm user account
app.get('/confirm/:confirmationCode', async (req, res) => {
  try {
    const { confirmationCode } = req.params;
    const decoded = jwt.verify(confirmationCode, SECRET_KEY);
    const email = decoded.email;

    const user = await User.findOneAndUpdate({ email }, { isVerified: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'Account confirmed successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login and issue JWT token
 *     description: Endpoint for user login
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             example:
 *               token: <user_token>
 *       401:
 *         description: Invalid email or account not verified.
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid email or account not verified.
 */

// Login and issue JWT token
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and is verified
    const user = await User.findOne({ email, isVerified: true });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or account not verified.' });
    }

    // Check hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    // Issue JWT token
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1d' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token not provided.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Apply the middleware to routes that require authentication
app.use('/user/:userId', verifyToken);
app.use('/vehicle', verifyToken);
app.use('/journey', verifyToken);

// Now, only users with a valid token can access these routes
/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Endpoint to get user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               _id: <user_id>
 *               email: <user_email>
 *               username: <user_username>
 *               fullName: <user_fullName>
 *               isVerified: <user_isVerified>
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               error: User not found.
 */
app.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});
/**
 * @swagger
 * /user/{userId}:
 *   put:
 *     summary: Update user by ID
 *     description: Endpoint to update user details by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               fullName:
 *                 type: string
 *               isVerified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User details updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               _id: <user_id>
 *               email: <user_email>
 *               username: <user_username>
 *               fullName: <user_fullName>
 *               isVerified: <user_isVerified>
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               error: User not found.
 */

// Update user by ID
app.put('/user/:userId', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});
/**
 * @swagger
 * /user/{userId}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Endpoint to delete a user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               error: User not found.
 */

// Delete user by ID
app.delete('/user/:userId', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});




/**
 * @swagger
 * /vehicle:
 *   post:
 *     summary: Create a new vehicle
 *     description: Endpoint to create a new vehicle
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               yearsInUsage:
 *                 type: number
 *               uniqueId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle created successfully.
 *         content:
 *           application/json:
 *             example:
 *               _id: <vehicle_id>
 *               brand: <vehicle_brand>
 *               model: <vehicle_model>
 *               yearsInUsage: <vehicle_yearsInUsage>
 *               uniqueId: <vehicle_uniqueId>
 *       400:
 *         description: Error creating vehicle.
 *         content:
 *           application/json:
 *             example:
 *               error: Error creating vehicle.
 */


// CRUD operations for Vehicle
app.post('/vehicle', async (req, res) => {
    try {
      const newVehicle = new Vehicle(req.body);
      await newVehicle.save();
      res.status(201).json(newVehicle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
app.put('/vehicle/:vehicleId', async (req, res) => {

    try {
      const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.vehicleId, req.body, { new: true });
      res.status(200).json(updatedVehicle);
    } catch (error) {
      res.status(404).json({ error: 'Vehicle not found' });
    }
})
  app.get('/vehicle/:vehicleId', async (req, res) => {
    try {
      const vehicle = await Vehicle.findById(req.params.vehicleId);
      res.status(200).json(vehicle);
    } catch (error) {
      res.status(404).json({ error: 'Vehicle not found' });
    }
  });
 

app.delete('/vehicle/:vehicleId', async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.vehicleId);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Vehicle not found' });
  }
});

app.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const vehiclesWithJourneys = await Promise.all(
      vehicles.map(async (vehicle) => {
        const journeys = await Journey.find({ vehicleId: vehicle._id });
        return { ...vehicle.toObject(), journeys };
      })
    );
    res.status(200).json(vehiclesWithJourneys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 

 app.post('/journey', async (req, res) => {
  try {
    const { userId, vehicleId, distance, date } = req.body;
    // Assuming you have a function to calculate carbon emission based on the provided formula
    const carbonEmission = calculateCarbonEmission(distance);

    const newJourney = new Journey({ userId, vehicleId, distance, date, carbonEmission });
    await newJourney.save();

    res.status(201).json(newJourney);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/journey/:journeyId', async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.journeyId);
    res.status(200).json(journey);
  } catch (error) {
    res.status(404).json({ error: 'Journey not found' });
  }
});
app.get("/journeys",async(req,res)=>{
  try {
    const journeys = await Journey.find()
    res.status(200).json(journeys);
  } catch (error) {
    res.status(404).json({ error: 'Journeys not found' });
  }
})
// Function to calculate carbon emission 
function calculateCarbonEmission(miles) {
  // Assuming the formula: 35 miles/gallon and 8.8 kg CO2 is produced using each US gallon of fuel
  const emissionPerGallon = 8.8; // in kg
  const mileage = 35; // in miles/gallon

  const gallonsUsed = miles / mileage;
  const carbonEmission = gallonsUsed * emissionPerGallon;

  return carbonEmission;
}

// EcoSuggestions
app.get('/suggest/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const averageEmission = await Journey.aggregate([
      { $match: { userId: req.params.userId } },
      { $group: { _id: null, avgEmission: { $avg: '$carbonEmission' } } },
    ]);

    const message = `Consider alternating between using your car and going for public transportation. This is based on your average carbon emission ${averageEmission[0].avgEmission} kg.`;

   
 

      
    res.status(200).json({ suggestion: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


    

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get('/', (req, res) => {
  res.send('hello world')
})
