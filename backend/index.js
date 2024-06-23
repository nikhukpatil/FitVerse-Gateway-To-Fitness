const {app} = require('./app')
const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGO_URL;

const connection = () => {
    mongoose.connect(MONGO_URL).then(()=>{
        console.log("Connection established");
    }).catch((err)=>{
        console.log(`Error connection the the database ${err}`);
    })
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    connection();
    console.log(`Server running on ${PORT}!`);
})
