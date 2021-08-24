import express from 'express';
import injectRoutes from './routes/Router';

const app = express();
const port = 3001;

const server = () => {
  app.use([express.json(), express.urlencoded({extended:true})]);

  injectRoutes(app, '/api');

  app.get('/ping', (req:any, res:any) => {
    res.send(`Hello.  Today is ${new Date()}`)
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

export default server;