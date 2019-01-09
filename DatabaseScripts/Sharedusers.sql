CREATE TABLE "Sharedusers" (
  userid int,
  listid int,
  edit BOOLEAN,
  CONSTRAINT uc_shareduser UNIQUE (userid, listid),
  CONSTRAINT fk_userid FOREIGN KEY (userid) REFERENCES "Users"(id) ON DELETE CASCADE,
  CONSTRAINT fk_listid FOREIGN KEY (listid) REFERENCES "Lists"(listid) ON DELETE CASCADE
)
