import joi from "joi";

export default function userValidation(body){
    const userCreate = joi.object({
      email: joi.string().email(),
      password: joi.string().required(),
      pseudo: joi.string().required(),
      isAdmin: joi.boolean().required().default(false)
    })

    const userUpdate = joi.object({
      email: joi.string().email(),
      password: joi.string(),
      pseudo: joi.string(),
      isAdmin: joi.boolean()
    })

    const userLogin = joi.object({
      pseudo: joi.string(),
      password: joi.string(),
    })

    return {
        userCreate: userCreate.validate(body),
        userUpdate: userUpdate.validate(body),
        userLogin: userLogin.validate(body),
    }
}
