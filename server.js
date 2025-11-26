const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./tarefas.db", (err) => {
    if (err) console.error("Erro ao abrir banco:", err);
    else console.log("Banco SQLite conectado!");
});

db.run(`CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resposta TEXT,
    dificuldade TEXT,
    status TEXT DEFAULT 'pendente'
)`)

app.get("/tarefas", (req, resultado) => {
    db.all("SELECT * FROM tarefas", [], (err, rows) => {
        if (err) return resultado.status(500).json({ erro: err.message })
        resultado.json(rows)
    })
})

app.post("/tarefas", (req, resultado) => {
    const { resposta, dificuldade } = req.body
    db.run(
        "INSERT INTO tarefas (resposta, dificuldade) VALUES (?, ?)",
        [resposta, dificuldade],
        function (err) {
            if (err) return resultado.status(500).json({ erro: err.message })
            resultado.json({ mensagem: "Tarefa adicionada", id: this.lastID })
        }
    )
})

app.put("/tarefas/concluir/:id", (req, resultado) => {
    const { id } = req.params
    db.run(
        "UPDATE tarefas SET status = 'concluida' WHERE id = ?",
        [id],
        function (err) {
            if (err) return resultado.status(500).json({ erro: err.message })
            resultado.json({ mensagem: "Tarefa concluída" })
        }
    )
})

// Reabrir tarefa
app.put("/tarefas/pendente/:id", (req, resultado) => {
    const { id } = req.params
    db.run(
        "UPDATE tarefas SET status = 'pendente' WHERE id = ?",
        [id],
        function (err) {
            if (err) return resultado.status(500).json({ erro: err.message })
            resultado.json({ mensagem: "Tarefa reaberta" })
        }
    )
})

app.put("/tarefas/:id", (req, resultado) => {
    const { id } = req.params
    const { resposta, dificuldade } = req.body

    db.run(
        "UPDATE tarefas SET resposta = ?, dificuldade = ? WHERE id = ?",
        [resposta, dificuldade, id],
        function (err) {
            if (err) return resultado.status(500).json({ erro: err.message })
            resultado.json({ mensagem: "Tarefa editada" })
        }
    )
})

// Deletar tarefa
app.delete("/tarefas/:id", (req, resultado) => {
    const { id } = req.params

    db.run(
        "DELETE FROM tarefas WHERE id = ?",
        [id],
        function (err) {
            if (err) return resultado.status(500).json({ erro: err.message })
            resultado.json({ mensagem: "Tarefa excluída" })
        }
    )
})

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"))
