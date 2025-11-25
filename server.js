const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()

const app = express()
app.use(express.json())
app.use(cors())

const db = new sqlite3.Database("./tarefas.db", (err) => {
    if (err) console.error("Erro ao abrir banco:", err)
    else console.log("Banco SQLite conectado!")
})

db.run(`CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resposta TEXT,
    dificuldade TEXT,
    status TEXT DEFAULT 'pendente'
)`)

app.get("/tarefas", (req, res) => {
    db.all("SELECT * FROM tarefas", [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message })
        res.json(rows)
    })
})

app.post("/tarefas", (req, res) => {
    const { resposta, dificuldade } = req.body;
    db.run("INSERT INTO tarefas (resposta, dificuldade) VALUES (?, ?)", [resposta, dificuldade], function(err) {
        if (err) return res.status(500).json({ erro: err.message })
        res.json({ mensagem: "Tarefa adicionada", id: this.lastID })
    })
})

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"))
