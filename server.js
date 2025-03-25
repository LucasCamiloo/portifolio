const express = require ('express');
const app = express();
const port = 3000;


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/public/script.js');
  });

app.listen(port, () => {
    console.log(`Servidor rodando na porta:  ${port}`);
});