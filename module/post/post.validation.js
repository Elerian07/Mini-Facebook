import joi from 'joi';

export const createPostSchema = {

    body: joi.object().required().keys({
        content: joi.string().required(),
        images: joi.any()
    })
}
export const deleteSchema = {
    params: joi.object().required().keys({
        id: joi.string().required()
    })
}
export const userPostSchema = {
    params: joi.object().required().keys({
        id: joi.string().required()
    })
}