// const mongoose = require('mongoose')
// const mongoURI = "mongodb://localhost:27017/"

// const connectToMongo = () =>{

//         mongoose.connect(mongoURI, ()=>{
//             console.log("Connected to mongo successfully")
//         })
// }

// module.exports = connectToMongo;

const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    // await mongoose.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directCOnnection=true&ssl=false', {
    await mongoose.connect('mongodb://127.0.0.1:27017/inotebook', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to Mongo uccessfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectToMongo;