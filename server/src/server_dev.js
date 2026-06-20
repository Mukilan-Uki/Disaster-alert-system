process.env.PORT = process.env.PORT || '5001';
const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Dev server listening on port ${port}`);
});
