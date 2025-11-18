/*Importações*/
const promptSync = require("prompt-sync");
const mysql = require("mysql2/promise");
const { createPool } = require("mysql2");

const prompt = promptSync({ sigint: true });

/*Conexão com o MySQL*/
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Etec",
    database: "gerenciador_de_tarefas",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

/*Funções*/
async function adicionarTarefas() {
    try {
        const nome = prompt("Digite uma nova tarefa: ")
        const dificuldade = prompt("Digite a dificuldade da tarefa: ")

        const sql = "INSERT INTO tarefas (resposta, dificuldade) VALUES (?, ?)"
        await db.query(sql, [nome, dificuldade])
        console.log("\nTarefa adicionada com sucesso!\n")
    } catch (erro) {
        console.log("\n[ERRO] Não foi possível adicionar a tarefa!\n")
    }
}

async function listarTarefas() {
    try {
        const sql = "SELECT * FROM tarefas"
        const [resultado] = await db.query(sql)

        if (resultado.length === 0) {
            console.log("\nNenhuma tarefa adicionada!\n")
        } else {
            resultado.forEach(tarefa => {
                console.log(`ID ${tarefa.id}: ${tarefa.resposta}  ||  Dificuldade: ${tarefa.dificuldade}  || Status: ${tarefa.status}`);
            })
        }
        return resultado;
    } catch (erro) {
        console.log("\n[ERRO] Não foi possível listar as tarefas!\n")
        return [];
    }
}


async function deletarTarefas() {
    try {
        const lista = await listarTarefas()
        if (lista.length === 0) return;

        const deletar = parseInt(prompt("Digite o ID da tarefa em que você deseja deletar: "))
        const sql = "DELETE FROM tarefas WHERE id = ?"
        const [resultado] = await db.query(sql, [deletar])

        if(resultado.affectedRows === 0) {
            console.log("\n[ERRO] Nenhuma tarefa identificada!\n")
        } else {
            console.log("\nTarefa excluída com sucesso!\n")
        }
    } catch (erro) {
        console.log("\n[ERRO] Não foi possível deletar uma tarefa!\n")
    }
}

async function editarTarefa() {
    try {
        const lista = listarTarefas()
        if (lista.length === 0) return;

        const id = prompt("Digite o ID da tarefa em que você deseja editar: ")
        const sql = "SELECT * FROM tarefas WHERE id = ?"
        const [resultado] = await db.query(sql, [id])
        if (resultado.length === 0) {
            console.log("\nNenhuma tarefa encontrada\n")
        } 

        const tarefaAtual = resultado[0]
        console.log("\n-- Deixe em branco para manter qualquer informação --\n")
        const novoNome = prompt(`Nova tarefa (${tarefaAtual.resposta}): `)
        const novaDificuldade = prompt(`Dificuldade da nova tarefa (${tarefaAtual.dificuldade}): `)

        const nomeTarefa = novoNome.trim() === "" ? tarefaAtual.resposta : novoNome
        const atualDificuldade = novaDificuldade.trim() === "" ? tarefaAtual.dificuldade : novaDificuldade

        const sqlUpdate = "UPDATE tarefas SET resposta = ?, dificuldade = ? WHERE id = ?"
        const [resultadoUpdate] = await db.query(sql, [nomeTarefa, atualDificuldade, id])

        if (resultadoUpdate.affectedRows === 0) {
            console.log("\nNenhuma tarefa foi editada!\n")
        } else {
            console.log("\nTarefa atualizada com sucesso!\n")
        } 
    }
    catch (erro) {
        console.log("\n[ERRO] Não foi possível editar as tarefas\n")
    }
}

async function concluirTarefa() {
   try {
        const lista = await listarTarefas()
        const id = parseInt(prompt("Digite o ID da tarefa que irá marcar como concluída: "))
        if (lista.length === 0) return;
        
        const sql = "UPDATE tarefas SET status = 'concluida' WHERE id = ?"
        const [resultado] = await db.query(sql, [id])

        if (resultado.affectedRows === 0) {
            console.log("\nNenhuma tarefa foi concluída\n")
        } else {
            console.log("\nTarefa concluída com sucesso!\n")
        }
   } catch (erro) {
        console.log("\n[ERRO] Não foi possível concluir a tarefa\n")
   }
}

async function tarefaPendente() {
    try {
        const lista = await listarTarefas()
        const id = parseInt(prompt("Digite o ID da tarefa que você irá reabrir (deixá-la pendente): "))
        if (lista.length === 0) return;
        
        const sql = "UPDATE tarefas SET status = 'pendente' WHERE id = ?"
        const [resultado] = await db.query(sql, [id])

        if (resultado.affectedRows === 0) {
            console.log("\nNenhuma tarefa foi concluída\n")
        } else {
            console.log("\nTarefa reaberta com sucesso!\n")
        }
   } catch (erro) {
        console.log("\n[ERRO] Não foi possível reabrir a tarefa\n")
   }
}

/*Parte principal (que vai rodar todas as funções)*/
async function main() {
    let cont
    do {
        console.log("----------------------------------")
        console.log("      Gerenciador de Tarefas      ")
        console.log("----------------------------------")
        console.log("1 - Adicionar tarefa")
        console.log("2 - Deletar tarefa")
        console.log("3- Editar tarefa")
        console.log("4 - Listar tarefas")
        console.log("5- Concluir tarefa")
        console.log("6- Reabrir tarefa")
        console.log("0 - Sair")

        cont = parseInt(prompt("Escolha uma opção: "));

        switch (cont) {
            case 1:
                await adicionarTarefas();
                break;
            case 2:
                await deletarTarefas()
                break;
            case 3: 
                await editarTarefa();
                break;
            case 4:
                await listarTarefas();
                break;
            case 5: 
                await concluirTarefa();
                break;
            case 6: 
                await tarefaPendente()
                break;
            case 0:
                console.log("Saindo...");
                process.exit(0);
            default:
                console.log("[ERRO] Opção inválida!\n");
        }

    } while (cont !== 0)
}

main()
