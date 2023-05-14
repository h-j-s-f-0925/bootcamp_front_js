import express from "express";
import cors from "cors";

import { Request, Response } from "express";
import {databaseManager} from "@/db/database_manager";

export const app = express();
app.use(cors());

app.get("/tasks", async (req: Request, res: Response) => {
    const db = await databaseManager.getInstance();
    const result = await db.all("SELECT * FROM tasks");
    res.json(result);
  });
