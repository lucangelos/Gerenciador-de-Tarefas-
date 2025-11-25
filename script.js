const API = "http://localhost:3000/tarefas"

async function listarTarefas() {
    const resposta = await fetch(API)
    const tarefas = await resposta.json()

    const lista = document.getElementById("lista-tarefas")
    lista.innerHTML = ""

    tarefas.forEach(tarefa => {
        const li = document.createElement("li")

        li.innerHTML = `
            <strong>${tarefa.resposta}</strong>  
            <br>Dificuldade: ${tarefa.dificuldade}
            <br>Status: ${tarefa.status}

            <div class="botoes">
                <button class="editar" onclick="editarTarefa(${tarefa.id})">Editar</button>
                <button class="concluir" onclick="concluirTarefa(${tarefa.id})">Concluir</button>
                <button class="pendente" onclick="reabrirTarefa(${tarefa.id})">Pendente</button>
                <button class="deletar" onclick="deletarTarefa(${tarefa.id})">Excluir</button>
            </div>
        `;

        lista.appendChild(li)
    })
}

async function adicionarTarefa() {
    const resposta = document.getElementById("tarefa").value
    const dificuldade = document.getElementById("dificuldade").value

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resposta, dificuldade })
    })

    listarTarefas()
}

async function deletarTarefa(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" })
    listarTarefas()
}

async function editarTarefa(id) {
    const nova = prompt("Novo nome:")
    const dif = prompt("Nova dificuldade:")

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resposta: nova, dificuldade: dif })
    })

    listarTarefas()
}

async function concluirTarefa(id) {
    await fetch(`${API}/concluir/${id}`, { method: "PUT" })
    listarTarefas()
}

async function reabrirTarefa(id) {
    await fetch(`${API}/pendente/${id}`, { method: "PUT" })
    listarTarefas()
}

listarTarefas()
