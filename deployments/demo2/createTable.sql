create table products(
  name CHAR(80) primary key,
  category CHAR(80),
  warehouse CHAR(80),
  quantity INT
);

create table inventory(
  name CHAR(80) primary key,
  category CHAR(80),
  warehouse CHAR(80),
  quantity INT
);
