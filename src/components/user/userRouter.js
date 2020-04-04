const router = require('express').Router();
const userService = require('./userService');
const taskService = require('../task/taskService');

router.route('/').get(async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

router.route('/').post(async (req, res) => {
  const { name, login, password } = req.body;
  const user = await userService.createUser({ name, login, password });
  if (user !== undefined) {
    res.statusMessage = 'The user has been created';
    res.json(user);
  } else {
    res.status(400).send('Bad request');
  }
});

router.route('/:id').get(async (req, res) => {
  console.log('params', req.url);

  const user = await userService.getUserById(req.params.id);
  if (user !== undefined) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

router.route('/:id').put(async (req, res) => {
  const { id } = req.params;
  const { name, login, password } = req.body;
  const user = await userService.updateUser({ id, name, login, password });
  if (user !== undefined) {
    res.statusMessage = 'The user has been updated';
    res.json(user);
  } else {
    res.status(400).send('Bad request');
  }
});

router.route('/:id').delete(async (req, res) => {
  const { id } = req.params;
  let idDeleted = await userService.deleteUser(id);
  if (idDeleted) {
    idDeleted = await taskService.unassignUserTasks(id);
  }
  if (idDeleted) {
    res.status(204).send('The user has been deleted');
  } else {
    res.status(404).send('User not found');
  }
});

module.exports = router;