const mongoose = require('mongoose');

const db = async () => {
    try {
        const uri='mongodb://127.0.0.1:27017/abhiabhi';
        mongoose.set('strictQuery', false)
        await mongoose.connect(uri)
        console.log('Db Connected')
    } catch (error) {
        console.log(error);
    }
}

module.exports = db;