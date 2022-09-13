import express from "express";

const app = express();

app.get('/ads', (req, res) => {
    return res.json([
        {id: 1, name: "teste"},
        {id: 2, name: "teste2"},
        {id: 2, name: "teste3"}
    ])
})

app.listen(3333) 