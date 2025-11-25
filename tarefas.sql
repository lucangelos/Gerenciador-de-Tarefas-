CREATE TABLE tarefas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    resposta VARCHAR(75) NOT NULL,
    dificuldade VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente'
);

CREATE USER 'appuser'@'%' IDENTIFIED BY 'senha123';
GRANT ALL PRIVILEGES ON gerenciador_de_tarefas.* TO 'appuser'@'%';
FLUSH PRIVILEGES;

