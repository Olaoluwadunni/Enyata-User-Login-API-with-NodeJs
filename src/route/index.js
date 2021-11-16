const express = require('express')
const router = express.Router()
const { validation, checkIfUserExistForLogin, checkIfUserRegister, getWeatherReport } = require('../middleware')
const { createNewUser, loginUser } = require('../controller/index')
const { createIncidentReport, fetchAllIncidents, fetchUserIncidents } = require('../controller/incident')
const {createUserSchema} = require('../validations')

router.post(
    '/api/create-user',
    validation (createUserSchema, "body"),
    checkIfUserRegister,
    createNewUser
    )
router.post('/api/login-user', checkIfUserExistForLogin, loginUser)
router.post('/api/user-incident_report/:id', getWeatherReport, createIncidentReport)
router.get('/api/incident-reports', fetchAllIncidents)
router.get('/api/user-incident-report/:id', fetchUserIncidents)

module.exports = router