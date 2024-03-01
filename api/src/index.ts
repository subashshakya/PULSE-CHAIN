import express from 'express';
import { Connection } from './connection';
import ReportRoutes from './routes/report-routes';

const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');

let corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}

new Connection().init();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/reports', cors(corsOptions), ReportRoutes);
app.get('/', (req, res) => {
  res.send('Connection Established')
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})
