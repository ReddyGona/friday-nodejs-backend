const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(15).required().messages({
        'string.username': 'Invalida User Name Format',
        'string.empty': 'Username is required'
    }),
    email: Joi.string().email().lowercase().required().messages({
        'string.email': 'Invalid email format. Please provide a valid email address.',
        'string.empty': 'Email is required. Please enter your email address.'
    }),
    password: Joi.string()
        .pattern(/^(?=.*[A-Z])(?=.*[!@#$%&*()])(?=.*\d).{8,}$/)
        .messages({
            'string.pattern.base': 'Password must contain at least one capital letter, one special character, one numeric digit, and be at least 8 characters long.',
            'string.empty': 'Password is required. Please enter a password.'
        })
});

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required().messages({
        'string.email': 'Invalid email format. Please provide a valid email address.',
        'string.empty': 'Email is required. Please enter your email address.'
    }),
    password: Joi.string()
        .pattern(/^(?=.*[A-Z])(?=.*[!@#$%&*()])(?=.*\d).{8,}$/)
        .messages({
            'string.pattern.base': 'Password must contain at least one capital letter, one special character, one numeric digit, and be at least 8 characters long.',
            'string.empty': 'Password is required. Please enter a password.'
        })
});

const taskSchema = Joi.object({
    title: Joi.string().min(1).required(),
    dueDate: Joi.string().min(1).required(),
    status: Joi.string().min(1).required()
});

export { registerSchema, loginSchema, taskSchema };
