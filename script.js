const express = require('express');
const mysql = require('mysql');
const path = require("path");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydatabase'
});

connection.connect(function(err) {
  if (err) {
    console.error('Błąd połączenia z bazą danych: ' + err.stack);
    return;
  }
  console.log('Połączono z bazą danych');
});

// Strona główna
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Pobieranie wszystkich projektów
app.get('/projects', function(req, res) {
  const query = 'SELECT * FROM projects';

  connection.query(query, function(err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// Pobieranie zadań przypisanych do danego projektu wraz z informacjami o użytkowniku
app.get('/tasks/:projectId', function(req, res) {
  const projectId = req.params.projectId;
  const query = 'SELECT tasks.*, users.name AS user_name FROM tasks JOIN users ON tasks.user_id = users.id WHERE tasks.project_id = ?';

  connection.query(query, [projectId], function(err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// Pobieranie wszystkich użytkowników
app.get('/users', function(req, res) {
  const query = 'SELECT * FROM users';

  connection.query(query, function(err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// Dodawanie użytkownika
app.post('/users', function(req, res) {
  const { name, last_name } = req.body;
  const user = { name, last_name };
  const query = 'INSERT INTO users SET ?';

  connection.query(query, user, function(err, result) {
    if (err) throw err;
    console.log('Dodano użytkownika:', user);
    res.sendStatus(200);
  });
});

// Dodawanie projektu
app.post('/projects', function(req, res) {
  const { name } = req.body;
  const project = { name };
  const query = 'INSERT INTO projects SET ?';

  connection.query(query, project, function(err, result) {
    if (err) throw err;
    console.log('Dodano projekt:', project);
    res.sendStatus(200);
  });
});

// Dodawanie zadania
app.post('/tasks', function(req, res) {
  const { name, project_id, user_id } = req.body;
  const task = { name, project_id, user_id };
  const query = 'INSERT INTO tasks SET ?';

  connection.query(query, task, function(err, result) {
    if (err) throw err;
    console.log('Dodano zadanie:', task);
    res.sendStatus(200);
  });
});

const port = 3000;
app.listen(port, function() {
  console.log('Aplikacja nasłuchuje na porcie ' + port);
});
