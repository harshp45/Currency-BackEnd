const mongoose = require('mongoose');
const config = require('config');


const dbconn = config.get('mongoDBConnectURI');

const connectDB = async () => {
    try
    {
        await mongoose.connect(dbconn);
        console.log("Database Connected");
    }
    catch (err)
    {
        console.log("Unable to Connect: "+err);
        process.exit();
    }
}

module.exports = connectDB;
