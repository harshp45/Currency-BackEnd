const mongoose = require('mongoose');


const NewsSchema = new mongoose.Schema({  
    status: String,
    totalResults: Number,   
    articles:
    [{
        name: String,
        author: String,
        title: String,
        description: String,
        url: String,
        content: String
    }]
});

const news = mongoose.model('news', NewsSchema);

module.exports = news;

