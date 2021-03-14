import dbConnect from './db';
import server from './server';

server.listen()
  .then(async ({url}) => {
    try {
      await dbConnect();
      console.log(`Server is running at ${url}🚀`)
    } catch (error) {
      console.log(error);
    }
  })

