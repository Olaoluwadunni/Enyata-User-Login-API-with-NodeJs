const db = require('../db')
const queries = require('../db/queries/index')
const { hashPassword, comparePassword, generateToken } = require('../utils')
const axios = require('axios').default

const createUser = async(body) => {
    const { email, password, firstName, lastName } = body
    const encryptedPassword = await hashPassword(password)

    const payload = [ email, password, firstName, lastName ]
    return db.one(queries.addNewUser, payload)
}

// Validate user registration
const validateUserReg = (body) => {
    const { email, password, firstName, lastName } = body

    if (!(email && password && firstName && lastName))
    throw new Error('Ensure all fields are required')

    return true
}

// Validate user login
const validateUserLogin = (body) => {
    const { email, password } = body
    if (!(email && password))
    throw new Error('Ensure all fields are required')
    return true
}

//Validate password
const validatePassword = async(user, password) => {
    console.log(user);
    const isValid = await comparePassword(password, user.password)

    if (isValid) {
        const token = await generateToken(user)
        return { token }
    }
    return false
}

// getting user
const getUser = email => db.any(queries.getUser, email)

// Fetch weather data from api
const fetchWeather = async(city, country) => {
    const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ city },${ country }&appid=${ process.env.WEATHER_API_KEY }`)

    if (weather)
        return weather

    return false
}

// Creating report
const createReport = (req) => {
    const { body, user_id, weather } = req
    const { incident_description, city, country } = body

    const payload = [ user_id, incident_description, city, country, weather ]

    return db.one(queries.addIncidentReport, payload)
}

// Getting all incidents
const getAllIncidents = () => db.any(queries.getIncidents)

// Getting individual incidents
const getUserIncident = id => db.any(queries.getUserIncidents, id)

const updatePassword = async(req) => {
    const { body: {password}, user: {id}} = req
    const encryptedPassword = await hashPassword(password)
    return db.one(queries.updatePassword, [encryptedPassword,id])

}

module.exports = {
    createUser,
    validatePassword,
    getUser,
    fetchWeather,
    createReport,
    getAllIncidents,
    getUserIncident,
    updatePassword
}