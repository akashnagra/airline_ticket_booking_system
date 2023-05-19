const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { Customer } = require('./models');

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
