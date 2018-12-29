CREATE TABLE "Lists" (
listid serial PRIMARY KEY,
owner int,
name text NOT NULL,
done BOOLEAN default false,
shareduser int,
FOREIGN KEY (owner) REFERENCES "Users"(id),
FOREIGN KEY (shareduser) REFERENCES "Users"(id)
)
