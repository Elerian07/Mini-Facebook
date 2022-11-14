
import joi from 'joi';

export const createCommentSchema = {

    body: joi.object().required().keys({
        content: joi.string().required(),
    })
}