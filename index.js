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
//Connect to DB
connectDB();

app.use(cors());

app.use(express.json())

app.use('/user', userRoute);
app.use('/currency', currencyRoute);
app.use('/weather', weatherRoute);
app.use('/news', newsRoute);
app.use('/currencies',currencies);
app.use('/stocks',stockRouter);
app.listen(5000, console.log('Server is Ready'));

