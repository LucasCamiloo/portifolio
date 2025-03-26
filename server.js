const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve all static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to handle all requests and serve index.html for the main site
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Project routes
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

app.get('/404.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '404.css'));
});

//404
app.get('*', function(req, res){
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});


if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`);
  });
}

module.exports = app;