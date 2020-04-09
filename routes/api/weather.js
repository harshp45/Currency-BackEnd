var http = require("http");
const express = require('express');
const app = express();
const auth = require('../../middleware/auth');
const weatherlist = require('../../models/Weather');
const router = express.Router();

const apiURL = "http://api.weatherstack.com/current?query=Toronto&access_key=89a06ce72c2ba0295a687cafc1ae1a75"

//fetching live weather through API
http.get(apiURL, function(res)
{
    var body = "";
    res.on('data', function(data) 
    {
        body += data;
        //console.log(body);
    });

     //Adding the weather into MongoDB just for reference
     router.post('/add', auth, async (req,res) => 
     {
        try
        {
            var weatherResponse = JSON.parse(body);
            const newweather = new weatherlist({
                location: 
                [{
                    name: weatherResponse.location.name,         
                    country: weatherResponse.location.country,
                    region: weatherResponse.location.region,
                    localtime: weatherResponse.location.localtime
                }],
                current:
                [{
                    temperature: weatherResponse.current.temperature,
                    wind_speed: weatherResponse.current.wind_speed,
                    wind_dir: weatherResponse.current.wind_dir,
                    pressure: weatherResponse.current.pressure,
                    precipitation: weatherResponse.current.precipitation,
                    humidity: weatherResponse.current.humidity,
                    cloudcover: weatherResponse.current.cloudcover,
                    feelslike: weatherResponse.current.feelslike,
                    is_day: weatherResponse.current.is_day
                }]
            });
    
            const nWeather = await newweather.save();
            res.json(nWeather);
            res.end();   
        }
        catch (err) 
        {
            res.status(500).send('Server Error');
        }
    });

    //Fetching Weather Data from MongoDB
    router.get('/list', auth, async (req,res) => 
    {   
        try
        {
            const WeatherDb = await weatherlist.findOne();
            res.send(WeatherDb);

        }
        catch (err)
        {
            res.status(500).send('Server Error');
        }
    });

     //Updating the weather into MongoDB to get updated weather on React App
     router.put('/update', auth, async (req, res) => 
     {
        try
        {
            var weatherResponse = JSON.parse(body);
            const newweather = await weatherlist.findById("5e69568c66daab40642aa9c4");

                newweather.location = 
                [{
                    name: weatherResponse.location.name,         
                    country: weatherResponse.location.country,
                    region: weatherResponse.location.region,
                    localtime: weatherResponse.location.localtime
                }],
                newweather.current = 
                [{
                    temperature: weatherResponse.current.temperature,
                    wind_speed: weatherResponse.current.wind_speed,
                    wind_dir: weatherResponse.current.wind_dir,
                    pressure: weatherResponse.current.pressure,
                    precipitation: weatherResponse.current.precipitation,
                    humidity: weatherResponse.current.humidity,
                    cloudcover: weatherResponse.current.cloudcover,
                    feelslike: weatherResponse.current.feelslike,
                    is_day: weatherResponse.current.is_day
                }]
            
    
            const nWeather = await newweather.save();
            res.json(nWeather);
            res.end();   
        }
        catch (err) 
        {
            res.status(500).send('Server Error');
        }
    });

});

module.exports = router;