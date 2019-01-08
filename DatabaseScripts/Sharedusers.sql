CREATE TABLE "Sharedusers" (
  userid int,
  listid int,
  edit BOOLEAN,
  CONSTRAINT uc_shareduser UNIQUE (userid, listid),
  FOREIGN KEY (userid) REFERENCES "Users"(id),
  CONSTRAINT fk_listid FOREIGN KEY (listid) REFERENCES "Lists"(listid) ON DELETE CASCADE
)
