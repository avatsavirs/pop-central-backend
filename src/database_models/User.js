import {Schema, model} from 'mongoose';

const UserSchema = new Schema();

const User = model('user', UserSchema, 'users');

export default User;
