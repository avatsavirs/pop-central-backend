import {Schema, model} from 'mongoose';

const AccountSchema = new Schema();

const Account = model("account", AccountSchema, "accounts");

export default Account;
