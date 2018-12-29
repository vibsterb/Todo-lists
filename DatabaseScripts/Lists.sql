CREATE TABLE "Lists" (
listid serial PRIMARY KEY,
owner int,
name text NOT NULL,
done BOOLEAN default false,
shareduser int,
icons BOOLEAN default true,
FOREIGN KEY (owner) REFERENCES "Users"(id),
FOREIGN KEY (shareduser) REFERENCES "Users"(id)
)
