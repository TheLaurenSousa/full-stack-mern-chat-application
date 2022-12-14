const { Chat } = require('../models/chat.model');

module.exports.createChat = (request, response) => {
    const { title, description, language, owner } = request.body;
    Chat.create({title, description, language, owner})
        .then(chat => {
            response.json({message: "Success!", chat: chat});
        })
        .catch(err => response.json(err));
}

module.exports.getAllChats = (request, response) => {
    Chat.find({})
        .then(chats => response.json(chats))
        .catch(err => response.json(err));
}

module.exports.getChat = (request, response) => {
    Chat.findOne({_id: request.params.id })
        .then(chat => response.json(chat))
        .catch(err => response.json(err));
}

module.exports.updateChat = (request, response) => {
    Chat.findOneAndUpdate({_id: request.params.id}, request.body, {new:true})
        .then(updatedChat => response.json(updatedChat))
        .catch(err => response.status(400).json(err));
}

module.exports.deleteChat = (request, response) => {
    Chat.deleteOne({_id: request.params.id})
        .then(deleteConfirmation => 
            response.json({message: "Success!", deleteConfirmation: deleteConfirmation}))
        .catch(err => response.json(err));
}