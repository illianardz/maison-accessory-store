const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const initializePassport = require('./config/passport');
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const setupSwagger = require('./swagger');

// Add other routes as you build (e.g., orders, cart, reviews)

const app = express();

// ========================
// Middleware Setup
// ========================
initializePassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// ========================
// Routes
// ========================
app.use('/', authRoutes);
app.use('/products', productsRoutes);
// Add more: app.use('/orders', ordersRoutes), etc.

// ========================
// Home (Optional Debug Route)
// ========================
app.get('/', (req, res) => {
  res.send('Welcome to the Maison Accessory Store API');
});

// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 3000;

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const cartRouter = require('./routes/cart');
app.use('/cart', cartRouter);

const ordersRouter = require('./routes/orders');
app.use('/orders', ordersRouter);
