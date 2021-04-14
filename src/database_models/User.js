import {Schema, model} from 'mongoose';

const ListSchema = new Schema({
  title: String,
  listItems: [{
    title: String,
    url: String,
    externalId: String,
    mediaType: String
  }],
});

const UserSchema = new Schema({
  providerId: String,
  name: String,
  email: String,
  provider: String,
  image: String,
  lists: [ListSchema]
});

const User = model('user', UserSchema);

export default User;
