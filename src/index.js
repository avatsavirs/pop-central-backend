import config from './config';
import server from './server';

server.listen()
  .then(({url}) => {
    console.log(`Server is running at ${url}🚀`)
  })

