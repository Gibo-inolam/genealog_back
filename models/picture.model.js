import mongoose from 'mongoose';

const pictureSchema = new mongoose.Schema({
    image: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    membre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Membre',
      required: true
    }

}, { timestamps: true });

export default mongoose.model('Picture', pictureSchema);
