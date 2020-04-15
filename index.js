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
const loginRoute = require('./login/routes/user');

//Connect to DB
connectDB();
const port = process.env.PORT || 5000
app.use(cors());

app.use(express.json())

app.use('/user', userRoute);
app.use('/login', loginRoute);
app.use('/currency', currencyRoute);
app.use('/weather', weatherRoute);
app.use('/news', newsRoute);
app.use('/currencies',currencies);
app.use('/stocks',stockRouter);
app.listen(port, console.log('Server is Ready'));

