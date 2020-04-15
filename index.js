const express = require('express');
const app = express()
const userRoute = require('./routes/api/users');
const currencyRoute = require('./routes/api/currency');
const weatherRoute = require('./routes/api/weather');
const newsRoute = require('./routes/api/news');
const connectDB = require('./config/connectDB');
const stockRouter = require('./routes/api/stocks')
const currencies = require('./routes/api/currencies');
const cors = require('cors');

//Login Imports
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const dbConnection = require('./login/database') 
const MongoStore = require('connect-mongo')(session)
const passport = require('./login/passport');
const loginRoute = require('./login/routes/user');

//Connect to DB
connectDB();
const port = process.env.PORT || 5000
app.use(cors());

// MIDDLEWARE
app.use(morgan('dev'))
app.use(
	bodyParser.urlencoded({
		extended: false
	})
)
app.use(bodyParser.json())

// Sessions
app.use(
	session({
		secret: 'fraggle-rock', //pick a random string to make the hash that is generated secure
		store: new MongoStore({ mongooseConnection: dbConnection }),
		resave: false, //required
		saveUninitialized: false //required
	})
)

// Passport
app.use(passport.initialize())
app.use(passport.session()) // calls the deserializeUser

app.use('/logins', loginRoute);



app.use(express.json())

app.use('/user', userRoute);
app.use('/currency', currencyRoute);
app.use('/weather', weatherRoute);
app.use('/news', newsRoute);
app.use('/currencies',currencies);
app.use('/stocks',stockRouter);
app.listen(port, console.log('Server is Ready'));

