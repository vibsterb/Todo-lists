CREATE TABLE "Items" (
listid int,
name text NOT NULL,
checked BOOLEAN DEFAULT false,
duedate text,
importance text DEFAULT 'none',
tag text,
CONSTRAINT uc_items UNIQUE (name, listid),
FOREIGN KEY (listid) REFERENCES "Lists"(listid)
)
