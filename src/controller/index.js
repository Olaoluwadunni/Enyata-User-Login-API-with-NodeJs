const {createUser, validateUserLogin } = require('../services/index')

const createNewUser = async (req, res, next) => {
    try {
        const { body } = req
        const newUser = await createUser(body)

        res.status(201).json({
            status: 'success',
            message: `User created successfully`,
            data: newUser
        })
    } 
    catch (error) {
        return next(error)
    }
}

const loginUser = async(req, res, next) => {
    try {
        const { email, password } = req
        const validated = await validateUserLogin(email, password)

        res.status(201).json({
            status: 'success',
            message: `User logged in successfully`,
            data: validated
        })
    } catch (error) {
        res.status(401).json({
            status: 'fail',
            message: error.message
        })
    }
    next()
}

const forgotPassword = async (req, res, next) => {
    try {
        const user = await updatePassword(req)
        res.status(200).json({
            status: 'success',
            message: 'Use this token to reset your password',
            data: user
        })
    } catch (error) {
       next(error) 
    }
}

const resetPassword = async (req, res, next) => {
    try{
        const {token} = req
        res.status(200).json({
            status: 'success',
            message: 'use this token to reset your password',
            data: token
        })
    } catch(error) {
        next(error)
    }
}

module.exports = { createNewUser, loginUser, forgotPassword, resetPassword }

