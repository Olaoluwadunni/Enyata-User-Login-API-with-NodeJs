const Joi = require('joi')

const createUserSchema = { 
    schema: Joi.object().keys({
        email: Joi.string().email().required(),
        firstname: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().required()
    }),
    message: 'Error creating new User'
}

module.exports = {createUserSchema}