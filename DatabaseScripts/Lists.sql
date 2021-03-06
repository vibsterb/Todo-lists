CREATE TABLE "Lists" (
listid serial PRIMARY KEY,
owner int,
name text NOT NULL,
done BOOLEAN default false,
shareduser int,
icons BOOLEAN default false,
image text default 'post-it.png',
FOREIGN KEY (owner) REFERENCES "Users"(id),
FOREIGN KEY (shareduser) REFERENCES "Users"(id)
)
