const express = require('express');
const console = require('console');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { usersRoutes } = require('./routes/users');
const { cardsRoutes } = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const errorHandler = require('./midlleware/errorHandler');
const validators = require('./midlleware/validations');

const app = express();

app.use(bodyParser.json());

app.use(cookieParser());

app.use(usersRoutes);
app.use(cardsRoutes);
app.post('/signup', validators.register, validators.url, express.json(), createUser);
app.post('/signin', express.json(), login);
app.use(errors());
app.use(errorHandler);
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
