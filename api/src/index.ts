import express from 'express';
import { Connection } from './connection';
import ReportRoutes from './routes/report-routes';

const app = express();
const port = 3000;

new Connection().init();

app.use('/reports', ReportRoutes);
app.get('/', (req, res) => {
  res.send('Connection Established')
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})
