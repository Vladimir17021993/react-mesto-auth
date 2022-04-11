const express = require('express');
const console = require('console');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { usersRoutes } = require('./routes/users');
const { cardsRoutes } = require('./routes/cards');
const {
  createUser,
} = require('./controllers/users');

const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '6242f5258d1601af56ec4d6b',
  };

  next();
});

app.use(usersRoutes);
app.use(cardsRoutes);
app.post('/signup', express.json(), createUser);
app.use((req, res, next) => {
  res.status(404).send({ message: 'Wrong URL' });
  next();
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');

  app.listen(PORT, () => {
    console.log(`Server listen on ${PORT}`);
  });
}

main();
