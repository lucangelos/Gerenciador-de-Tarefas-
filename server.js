const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Etec",
    database: "gerenciador_de_tarefas"
})

app.get("/tarefas", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM tarefas")
        res.json(rows)
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar" })
    }
});

// Adicionar tarefa
app.post("/tarefas", async (req, resultado) => {
    try {
        const { resposta, dificuldade } = req.body;

        await db.query("INSERT INTO tarefas (resposta, dificuldade) VALUES (?, ?)",[resposta, dificuldade]);
        resultado.json({ mensagem: "Tarefa adicionada" });
    } catch {
        res.status(500).json({ erro: "Erro ao adicionar" });
    }
});

// Editar tarefa
app.put("/tarefas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { resposta, dificuldade } = req.body;

        const [resultado] = await db.query(
            "UPDATE tarefas SET resposta = ?, dificuldade = ? WHERE id = ?",
            [resposta, dificuldade, id]
        );

        if (resultado.affectedRows === 0)
            return res.status(404).json({ erro: "Tarefa não encontrada" });

        res.json({ mensagem: "Tarefa editada" });
    } catch {
        res.status(500).json({ erro: "Erro ao editar" });
    }
});

// Deletar tarefa
app.delete("/tarefas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [resultado] = await db.query(
            "DELETE FROM tarefas WHERE id = ?",
            [id]
        );

        res.json({ mensagem: "Tarefa excluída" });
    } catch {
        res.status(500).json({ erro: "Erro ao excluir" });
    }
});

// Concluir tarefa
app.put("/tarefas/concluir/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            "UPDATE tarefas SET status = 'concluida' WHERE id = ?",
            [id]
        );

        res.json({ mensagem: "Tarefa concluída" });
    } catch {
        res.status(500).json({ erro: "Erro ao concluir" });
    }
});

// Reabrir tarefa
app.put("/tarefas/pendente/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            "UPDATE tarefas SET status = 'pendente' WHERE id = ?",
            [id]
        );

        res.json({ mensagem: "Tarefa reaberta" });
    } catch {
        res.status(500).json({ erro: "Erro ao reabrir" });
    }
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
