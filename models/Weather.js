const mongoose = require('mongoose');


const WeatherSchema = new mongoose.Schema({  
    
    location : 
    [{
        name: String,         
        country: String,
        region: String,
        localtime: String
    }],
    current:
    [{
        temperature: Number,
        wind_speed: Number,
        wind_dir: String,
        pressure: Number,
        precipitation: Number,
        humidity: Number,
        cloudcover: Number,
        feelslike: Number,
        is_day: String
    }]

});

const weather = mongoose.model('weathers', WeatherSchema);

module.exports = weather;
