import mongoose from 'mongoose'
import config from './config'

function dbConnect(url = config.db_url, options = {}) {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ...options
  });
}

export default dbConnect;
