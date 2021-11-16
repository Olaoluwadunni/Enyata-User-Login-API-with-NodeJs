const { validateUserReg, validateUserLogin, getUser, fetchWeather, validateReportInput, getUserById } = require('../services/index')

const checkIfUserRegister = async(req, res, next) => {
    try {
        const { body } = req
        const validated = validateUserReg(body)

        if (validated) {
            const { email } = body
            const [ user ] = await getUser(email)
           
            if (user) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'Oops, User already exists. Log in',
                    data: []
                })
            }
    
            req.body = body
            next()
        }

    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
            data: []
        })
    }
}

const checkIfUserExistForLogin = async(req, res, next) => {
    try {
        const { body } = req
        const validated = validateUserLogin(body)

        if (validated) {
            const { email } = body
            const [ user ] = await getUser(email)

            if (user) {
                return res.status(201).json({
                    status: 'success',
                    message: 'Congratulations You are logged in successfully!',
                    data: []
                })
            }
            req.user = user
            req.password = password
            next()
        }
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
            data: []
        })
    }
}

//alternative way for validation
const validation = (data, type) => async (req,res, next) => {
    try {
        const getType = {
            body: req.body,
            params: req.params,
            query: req.query,
            headers: req.headers,
          };
        const options = { language: { key: '{{key}} ' } };
        const result = getType[type];

        const isValid = await data.schema.validate(result, options);
        if (!isValid.error) {
            req[type] = isValid.value;
            return next();
          }
        const { message } = isValid.error.details[0];
        return res.status(400).json({
            status: 'failed',
            message: message.replace(/[\"]/gi, ''),
            errors: data.message,
        })
        // return errorResponse(req, res, {
        //      status: 'BAD REQUEST',
        //      message: message.replace(/[\"]/gi, ''),
        //      errors: data.message,
        // });
    } catch (error) {
        return next(error)
    }
}

const getWeatherReport = async(req, res, next) => {
    try {
        const { body, params: {id} } = req

        if (id) {
            const [user] = await getUserById(id)
            if (!user) {
                return res.status(401).json({
                    status: 'failed',
                    message: 'User does not exist'
                })
            }

            const { city, country } = body
            const weather = await fetchWeather(city, country)
            
            req.weather = weather.data
            req.user_id = id
            next()
        }
        
    }
    catch (error) {
        return res.status(404).json({
            status: 'failed',
            message: error.message
        })
    }
}

module.exports = {
    checkIfUserRegister,
    checkIfUserExistForLogin,
    getWeatherReport,
    validation
}