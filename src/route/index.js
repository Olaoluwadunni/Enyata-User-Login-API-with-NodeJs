const express = require('express')
const router = express.Router()
const { validateUser, getWeatherReport, verifyToken, checkIfUserRegister, generateResetPasswordToken } = require('../middleware')
const { createNewUser, loginUser, forgotPassword, resetPassword } = require('../controller/index')
const { createIncidentReport, fetchAllIncidents, fetchUserIncidents } = require('../controller/incident')
const { createUserSchema, loginUserSchema, createIncidentSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validations')

router.post(
    '/api/create-user',
    validateUser (createUserSchema, "body"),
    checkIfUserRegister('signup'),
    createNewUser
    )
router.post(
    '/api/login-user',
    validateUser(loginUserSchema, 'body'),
    checkIfUserRegister('login'),
    loginUser
    )
router.post(
    '/api/user-incident_report/:id',
    verifyToken('logged-in'),
    validateUser(createIncidentSchema, 'body'),
    getWeatherReport,
    createIncidentReport
    )
router.get(
    '/api/incident-reports',
    fetchAllIncidents
    )
router.get(
    '/api/user-incident-report/:id',
    fetchUserIncidents
    )
router.post(
    '/api/forgot-password',
    validateUser(forgotPasswordSchema, 'body'),
    generateResetPasswordToken, 
    forgotPassword 
    )
router.post(
    '/api/reset-password',
    validateUser(resetPasswordSchema, 'body'),
    verifyToken('reset-password'),
    resetPassword        
    )

module.exports = router