import joi from "joi";
import mongoose from "mongoose";


export default function personneValidation(body){
    // Helper pour valider un ObjectId
    const objectId = () =>
      joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
    }, "ObjectId validation");

    const cloudinaryImageSchema = joi.object({
      public_id: joi.string().allow(null),
      url: joi.string().uri().allow(null)
    }).allow(null);

    const personneCreate = joi.object({
      nom: joi.string(),
      prenom: joi.string(),
      genre: joi.boolean(),
      naissance: joi.string().allow(null),
      deces: joi.string().allow(null),
      lieuNaissance: joi.string().allow(null),
      lieuDeces: joi.string().allow(null),
      image: cloudinaryImageSchema,
      mid: objectId().allow(null),
      fid: objectId().allow(null),
      pids: joi.array().items(objectId()).default([])
      
    })
    
    const personneUpdate = joi.object({
      nom: joi.string(),
      prenom: joi.string(),
      genre: joi.boolean(),
      naissance: joi.string().allow(null),
      deces: joi.string().allow(null),
      lieuNaissance: joi.string().allow(null),
      lieuDeces: joi.string().allow(null),
      image: cloudinaryImageSchema,
      mid: objectId().allow(null),
      fid: objectId().allow(null),
      pids: joi.array().items(objectId()).default([])

    })

    return {
        personneCreate: personneCreate.validate(body),
        personneUpdate: personneUpdate.validate(body),
    }
}
