const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const models = {};
const mongoose = require('mongoose');

if (process.env.DB_HOST !== '') {

    fs.readdirSync(__dirname)

        .filter((file) => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })

        .forEach((file) => {
            const _model = require('./' + file);
            models[_model.modelName] = _model;
        });

    mongoose.Promise = global.Promise; //set mongo up to use promises

    // mongoose.set('debug', true);

    const mongo_location = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

    mongoose.connect(mongo_location, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true
    }).catch((err) => {
        console.log('*** Can Not Connect to Mongo Server:', mongo_location);
    });

    let db = mongoose.connection;
    module.exports = db;

    db.once('open', () => {
        console.log('Connected to mongo at ' + mongo_location);
    });

    db.on('error', (error) => {
        console.log("error", error);
    });

} else {
    console.log("No Mongo Credentials Given");
}

module.exports = models;