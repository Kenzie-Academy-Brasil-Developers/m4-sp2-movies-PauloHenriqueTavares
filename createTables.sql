create table movies(
id  BIGSERIAL PRIMARY KEY,
name VARCHAR(50) UNIQUE NOT NULL,
description TEXT ,
duration INT NOT NULL,
price INT NOT NULL
);

INSERT INTO 
movies(name, description, duration,price)
VALUES 
('Minha Mãe é Uma Peça', 'Minha Mãe É uma Peça (por vezes divulgado como Minha Mãe É uma Peça - o Filme) é um longa-metragem de comédia brasileiro dirigido por André Pellenz, protagonizado por Paulo Gustavo e escrito pelo mesmo em parceria com Fil Braz.', 1, 12);

SELECT 
	*
FROM 
	movies;
	