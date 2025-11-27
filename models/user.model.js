
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: false
    },
    password: {
      type: String,
      required: true
    },
    pseudo: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    }
}, { timestamps: true });

userSchema.pre("save", async function(){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10)
  }
})

userSchema.pre("findOneAndUpdate", async function () {
  let update = this.getUpdate();

  if (update.password) {
    const hashed = await bcrypt.hash(update.password, 10);

    this.setUpdate({
      ...update,
      password: hashed
    });
  }
})

export default mongoose.model('User', userSchema);
