CR"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
 gerenciador_de_tarefas;

CREATE TABLE tarefas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    resposta VARCHAR(75) NOT NULL,
    dificuldade VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente'
);
