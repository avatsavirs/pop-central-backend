import {Schema, model} from 'mongoose'

const TokenSchema = new Schema({
  accessToken: String,
  refreshToken: String,
  expirationTime: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
});

TokenSchema.virtual('isExpired').get(function () {
  return this.expirationTime * 1000 < Date.now();
})

const Token = model('token', TokenSchema);
export default Token;
