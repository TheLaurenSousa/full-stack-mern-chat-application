const { User } = require("../models/users.model");
require('dotenv').config();
const secretkey = process.env.SECRET_KEY;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.createUser = (request, response) => {
    const { username, password, confirmPassword } = request.body;
    User.create({username, password, confirmPassword})
        .then(user => {
            const userToken = jwt.sign({
                id: user._id,
                username: user.username
            }, process.env.SECRET_KEY);

            response.cookie("usertoken", userToken, secretkey, {
                httpOnly: true
            }).json({ message: "Success!", user: user });
        })
        .catch(err => response.json(err));
}

module.exports.getAllUsers = (request, response) => {
    User.find({})
        .then(users => response.json(users))
        .catch(err => response.json(err));
}

module.exports.getUser = (request, response) => {
    User.findOne({_id: request.params.id})
        .then(user => response.json(user))
        .catch(err => response.json(err));
}

module.exports.updateUser = (request, response) => {
    User.findOneAndUpdate({_id: request.params.id}, request.body, {new:true})
        .then(updatedUser => response.json(updatedUser))
        .catch(err => response.status(400).json(err));
}

module.exports.deleteUser = (request, response) => {
    User.deleteOne({_id: request.params.id})
        .then(deleteConfirmation => response.json(deleteConfirmation))
        .catch(err => response.json(err))
}

module.exports.login = (request, response) => {
    const user = User.findOne({ username: request.body.username })
        .then(user => {
            if (!user){
                return response.json({
                    message: "Username not found"
                });
            } else {
                bcrypt.compare(request.body.password, user.password)
                .then(match => {
                    if(!match){
                        return response.json({
                            message: "Invalid login"
                        });
                    }
                
                const userToken = jwt.sign({
                    id: user._id,
                    username: user.username
                }, process.env.SECRET_KEY);

                response.cookie("usertoken", userToken, secretkey, {
                    httpOnly: true
                }).json({ message: "Success!", user: user});
            });
            }
        });
}

module.exports.logout = (request, response) => {
    return response.clearCookie('usertoken')
    .status(200)
    .json({ msg: "Successfully logged out" });
}