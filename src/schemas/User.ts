import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcryptjs'
interface UserInterface extends Document{
  name: string
  email: string
  password: string
  // fullName(): string
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
}, {
  timestamps: true
})

UserSchema.pre<UserInterface>('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})
// UserSchema.methods.fullName = function (): string {
//   return `${this.firstName} ${this.lastName}`
// }

export default model<UserInterface>('User', UserSchema)
