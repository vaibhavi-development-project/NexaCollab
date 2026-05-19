const { body, validationResult } = require("express-validator")

const UserValidationResponse = (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message:errors.array()[0].msg
         })
    }

    next()
}

const registerUserValidator = [

    body("email")
    .trim()
        .isEmail()
        .withMessage("Enter valid Email Address"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Minimum length of the password must be 6")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[@$!%*?&]/)
        .withMessage("Password must contain at least one special character"),


    body("fullName.firstName")
        .trim()
        .isString()
        .withMessage("FirstName must be a string")
        .notEmpty()
        .withMessage("it is required")
        .matches(/^[A-Za-z]+$/)
        .withMessage("First name must contain only letters"),



    body("fullName.lastName")
        .trim()
        .isString()
        .withMessage("LastName must be a string")
        .notEmpty()
        .withMessage("it is required")
        .matches(/^[A-Za-z]+$/)
        .withMessage("First name must contain only letters"),

    UserValidationResponse

]


const loginUserValidator = [

    body("email")
    .trim()
        .isEmail()
        .withMessage("email did not matched"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be of length 6"),


    UserValidationResponse

]

module.exports = {
    registerUserValidator,
    loginUserValidator
}