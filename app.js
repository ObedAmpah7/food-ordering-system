require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

AdminBro.registerAdapter(AdminBroMongoose);
const MONGODB_URI =
  'mongodb+srv://obed:pinocchio577@cluster0.263vx.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');
const adminBro = new AdminBro({
  databases: [],
  rootPath: '/admin',
});


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const adminrouter = AdminBroExpress.buildRouter(adminBro);
app.use(adminBro.options.rootPath, adminrouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

const PORT = process.env.PORT;
const HOST = process.env.HOST;
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(PORT, HOST, function(){ 
      console.log(`app listen on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });

  
  
