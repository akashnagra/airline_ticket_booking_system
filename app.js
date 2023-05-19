const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const { Customer, Flight, Booking, FlightConfiguration } = require('./models');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());

app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.successFlash = req.flash('success');
  res.locals.errorFlash = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

passport.use(
  'customer',
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const customer = await Customer.findOne({ where: { email } });
      if (!customer) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, customer.password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, customer);
    } catch (error) {
      console.error(error);
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const customer = await Customer.findByPk(id);
    done(null, customer);
  } catch (error) {
    console.error(error);
    done(error);
  }
});

// Customer Registration
app.post('/api/customers', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({ name, email, password: hashedPassword });
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create customer.' });
  }
});

// Login
app.post('/api/login', passport.authenticate('customer'), (req, res) => {
  res.json({ message: 'Logged in successfully.' });
});

// Logout
app.get('/api/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logged out successfully.' });
});

// Flight Search
app.get('/api/flights', async (req, res) => {
  try {
    const { source, destination } = req.query;
    const flights = await Flight.findAll({
      where: {
        route: { [sequelize.Op.iLike]: `%${source}-${destination}%` },
      },
      include: [FlightConfiguration],
    });
    res.json(flights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch flights.' });
  }
});

// Flight Booking
app.post('/api/bookings', passport.authenticate('customer'), async (req, res) => {
  try {
    const { customerId, flightId } = req.body;
    const flight = await Flight.findByPk(flightId, { include: [FlightConfiguration] });
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found.' });
    }

    const flightConfig = flight.FlightConfiguration;
    const seatingArrangement = flightConfig.seatingArrangement.split(',');
    if (seatingArrangement.length === 0) {
      return res.status(400).json({ error: 'No available seats.' });
    }

    const seat = seatingArrangement.shift();
    await flightConfig.update({ seatingArrangement: seatingArrangement.join(',') });

    const booking = await Booking.create({ customerId, flightId, seat });
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
