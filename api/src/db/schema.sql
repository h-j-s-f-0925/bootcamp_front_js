BEGIN;
CREATE TABLE IF NOT EXISTS "tasks" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "title" TEXT NOT NULL, "status" INTEGER NOT NULL);
COMMIT;