import joi from 'joi';

export const deleteSchema = {
    authorization: joi.object().required().keys({
        id: joi.object().required()
    })
}

export const restPass = {
    body: joi.object().required().keys({
        currentPassword: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        newPassword: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        newCPassword: joi.string().valid(joi.ref("newPassword")).required(),
    })
}

export const getUserSchema = {
    params: joi.object().required().keys({
        id: joi.string().required()
    })
}