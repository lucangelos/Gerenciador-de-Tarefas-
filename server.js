const express = require("express")
const cors = require("cors")
const mysql = require("mysql2/promise")

const app = express()
app.use(express.json())
app.use(cors())

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Etec",
    database: "gerenciador_de_tarefas"
})

app.get("/tarefas", async (req, resultado) => {
    try {
        const [rows] = await db.query("SELECT * FROM tarefas")
        resultado.json(rows)
    } catch (err) {
        resultado.status(500).json({ erro: "Erro ao listar" })
    }
})

app.post("/tarefas", async (req, resultado) => {
    try {
        const { resposta, dificuldade } = req.body
        await db.query("INSERT INTO tarefas (resposta, dificuldade) VALUES (?, ?)",[resposta, dificuldade])
        resultado.json({ mensagem: "Tarefa adicionada" })
    } catch (err) {
        resultado.status(500).json({ erro: "Erro ao adicionar" })
    }
})

// Editar tarefa
app.put("/tarefas/:id", async (req, resultado) => {
    try {
        const { id } = req.params
        const { resposta, dificuldade } = req.body

        const [resEditar] = await db.query(
            "UPDATE tarefas SET resposta = ?, dificuldade = ? WHERE id = ?",
            [resposta, dificuldade, id]
        )

        if (resEditar.affectedRows === 0)
            return resultado.status(404).json({ erro: "Tarefa não encontrada" })

        resultado.json({ mensagem: "Tarefa editada" });
    } catch {
        resultado.status(500).json({ erro: "Erro ao editar" })
    }
})

// Deletar tarefa
app.delete("/tarefas/:id", async (req, resultado) => {
    try {
        const { id } = req.params

        await db.query("DELETE FROM tarefas WHERE id = ?", [id])

        resultado.json({ mensagem: "Tarefa excluída" })
    } catch {
        resultado.status(500).json({ erro: "Erro ao excluir" })
    }
})

app.put("/tarefas/concluir/:id", async (req, resultado) => {
    try {
        const { id } = req.params
        await db.query("UPDATE tarefas SET status = 'concluida' WHERE id = ?", [id])
        resultado.json({ mensagem: "Tarefa concluída" })
    } catch {
        resultado.status(500).json({ erro: "Erro ao concluir" })
    }
})

app.put("/tarefas/pendente/:id", async (req, resultado) => {
    try {
        const { id } = req.params
        await db.query("UPDATE tarefas SET status = 'pendente' WHERE id = ?", [id])
        resultado.json({ mensagem: "Tarefa reaberta" })
    } catch {
        resultado.status(500).json({ erro: "Erro ao reabrir" })
    }
})

app.listen(3000, () =>
    console.log("Servidor rodando em http://localhost:3000")
)
