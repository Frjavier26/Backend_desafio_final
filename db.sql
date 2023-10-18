CREATE DATABASE gamezone;

CREATE TABLE productos ( id SERIAL, product_name VARCHAR(256) NOT NULL, price INT NOT NULL, img_URL VARCHAR(500) NOT NULL, 
	short_description VARCHAR(200) NOT NULL, long_description VARCHAR(500) NOT NULL, user_email VARCHAR(100) NOT NULL UNIQUE);

CREATE TABLE usuarios (id SERIAL, user_name VARCHAR(50) NOT NULL, user_lastname VARCHAR(50) NOT NULL, user_email VARCHAR(100) NOT NULL, 
	user_password VARCHAR(500) NOT NULL);

SELECT * FROM productos
SELECT * FROM usuarios

INSERT INTO productos (id, product_name, price, img_URL, short_description, long_description, user_email) 
	values(default, 'nombre de prueba', 154990, 'https://todosqa.com/wp-content/uploads/2019/03/testing3.jpg', 
	'descripción corta del producto', 'descripción larga del producto', 'j@p.cl');

INSERT INTO productos (id, product_name, price, img_URL, short_description, long_description, user_email) 
	values(default, 'Producto de prueba', 1234990, 'https://i.blogs.es/a19bfc/testing/1366_2000.jpg', 
'ni alcanza para descripción', 'la mansa descripción del producto', '');