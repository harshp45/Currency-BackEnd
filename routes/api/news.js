var http = require("http");
const express = require('express');
const app = express();
const auth = require('../../middleware/auth');
const newslist = require('../../models/News');
const router = express.Router();

const apiURL = "http://newsapi.org/v2/top-headlines?country=ca&category=business&apiKey=71f36f2a25224f578e0a799df2e8f50b"

//fetching live news through API
http.get(apiURL, function(res)
{
    var body = "";
    res.on('data', function(data) 
    {
        body += data;
        //console.log(body);
    });

    
     //Adding the news into MongoDB just for reference
     router.post('/add', auth, async (req,res) => 
     {
        try
        {
            var newsResponse = JSON.parse(body);
            var arr = Array();    
            
            for(var i=0;i<newsResponse.articles.length;i++)
            {
                arr.push(
                    {
                        "name":newsResponse.articles[i].source.name,
                        "author":newsResponse.articles[i].author,
                        "title":newsResponse.articles[i].title,
                        "description":newsResponse.articles[i].description,
                        "url":newsResponse.articles[i].url,
                        "content":newsResponse.articles[i].content
                    }
                )
            }
            const articlesdata = arr;
            const newNews = new newslist({
                status: newsResponse.status,
                totalResults: newsResponse.totalResults,
                articles: articlesdata
            });
    
            const nNews = await newNews.save();
            res.json(nNews);
            res.end();   
        }
        catch (err) 
        {
            res.status(500).send('Server Error');
        }
    });

    //Fetching news Data from MongoDB
    router.get('/list', auth, async (req,res) => 
    {   
        try
        {
            const newsDb = await newslist.findOne();
            res.send(newsDb);

        }
        catch (err)
        {
            res.status(500).send('Server Error');
        }
    });

     //Updating the currency rates into MongoDB to get updated rates on React App
     router.put('/update', async (req, res) => {
        try
        {
            var newsResponse = JSON.parse(body);
            var arr = Array();    
            
            for(var i=0;i<newsResponse.articles.length;i++)
            {
                arr.push(
                    {
                        "name":newsResponse.articles[i].source.name,
                        "author":newsResponse.articles[i].author,
                        "title":newsResponse.articles[i].title,
                        "description":newsResponse.articles[i].description,
                        "url":newsResponse.articles[i].url,
                        "content":newsResponse.articles[i].content
                    }
                )
            }
            const articlesdata = arr;
            const newNews = await newslist.findById("5e697689e6c160330478ba3e");
            
            newNews.status = newsResponse.status,
            newNews.totalResults = newsResponse.totalResults,
            newNews.articles = articlesdata
            
    
            const nNews = await newNews.save();
            res.json(nNews);
            res.end();   
        }
        catch (err) 
        {
            res.status(500).send('Server Error');
        }
     });
});

module.exports = router;