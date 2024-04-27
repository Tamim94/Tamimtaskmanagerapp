const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
console.log('TOKEN_SECRET:', config.TOKEN_SECRET); //USER MARCHE JAI OUBLIERRR DE METTRE LE TOKEN DANS LA FONCRION


const { Schema } = mongoose;

const UserSchema = new Schema({
    fullName: {
        type: String,
    },
    job: {
        type: String,
    },
    role: {
        type: String,
        enum: ['rh', 'admin', 'employee']
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task',
    }],
}, {
    timestamps: true
});

UserSchema.pre('save', async function (next) {
    if (this.password) {
        if (this.isModified('password') || this.isNew) {
            this.password = bcrypt.hashSync(this.password, 8);
            next();
        } else {
            next();
        }
    } else {
        next();
    }
});

UserSchema.methods.comparePassword = function (pw) {
    let passwordIsValid = bcrypt.compareSync(pw, this.password);
    return !!passwordIsValid;
}

UserSchema.methods.getJWT = function () {
    return jwt.sign({
        id: this._id.toString()
    }, config.TOKEN_SECRET || '1', {
        expiresIn: 86400
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;