import mongoose from 'mongoose';

const personneSchema = new mongoose.Schema({
    nom: {
      type: String
    },
    prenom: {
      type: String
    },
    genre: {
      type: Boolean
    },
    naissance: {
      type: String
    },
    deces: {
      type: String
    },
    lieuNaissance: {
      type: String
    },
    lieuDeces: {
      type: String
    },
    mid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Personne',
      default: null
    },
    fid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Personne',
      default: null
    },
    pids: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Personne'
    }],
    image: {
public_id: {
    type: String,
    default: null
  },
  url: {
    type: String,
    default: null
  }    }
}, { timestamps: true });

export default mongoose.model('Personne', personneSchema);
