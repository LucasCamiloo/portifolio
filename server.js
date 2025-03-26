const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/projects/dyp', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projects', 'dyp.html'));
});

app.get('/projects/orientacao-vocacional', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projects', 'orientacao-vocacional.html'));
});

app.get('/projects/portfolio', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projects', 'portifolio.html'));
});

app.get('/projects/project-reset.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projects', 'project-reset.css'));
});


//404
app.get('*', function(req, res){
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});