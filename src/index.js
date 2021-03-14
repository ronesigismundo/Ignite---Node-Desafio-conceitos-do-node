const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers

  const user = users.find(user => user.username === username)

  if(!user){
    return response.status(404).json({ "error": "User not found" });
  }

  request.user = user

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body

  const userAlreadyExist =users.some((user) => user.username === username)
  if(userAlreadyExist) {
    return response.status(400).json({ "error": "Username already exists!" });
  }

  const user = {
    id: uuid(),
    name: name,
    username: username,
    todos: []
  }

  users.push(user);

  return response.status(201).send(user)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {todos} = request.user;
  return response.status(200).json(todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body

  const { user } = request

  const todo = {
    id: uuid(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(todo)

  return response.status(201).json(todo)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body;
  const {id} = request.params;
  const { todos } = request.user;

  let todo = todos.find(todo => todo.id === id )

  if(!todo){
    return response.status(404).json({"error": "Todo not found!"});
  }

  todo.title = title,
  todo.deadline = new Date(deadline);

  return response.status(200).json(todo)


});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { todos } = request.user;

  const todo = todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(404).json({"error": "Todo not found!"});
  }

  todo.done = true;

  return response.status(200).json(todo)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;


  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if(todoIndex === -1){
    return response.status(404).json({"error": "Todo not found!"});
  }

  user.todos.splice(todoIndex, 1)

  return response.status(204).send();
});

module.exports = app;