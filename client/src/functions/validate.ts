import * as Joi from "joi"

const schema = Joi.object({
    email: Joi.string()
        .pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$')),
    name: Joi.string().min(3).max(50),
    username: Joi.string().min(3).max(50).pattern(/^(?![+]).*/),
    phone: Joi.string()
        .pattern(/^[+][0-9]{5,15}$/s),
    dateOfBirth: Joi.date().max('now'),
    otp: Joi.number().min(100000).max(999999),
})

export { schema }