import joi from "joi";
import mongoose from "mongoose";

export default function pictureValidation(body){
    // Helper pour valider un ObjectId
    const objectId = () =>
      joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
    }, "ObjectId validation");
    
    

    const pictureCreate = joi.object({
      image: joi.string().required(),
      alt: joi.string().required(),
      membre: objectId().required()
    })

    return {
        pictureCreate: pictureCreate.validate(body),
    }
}
