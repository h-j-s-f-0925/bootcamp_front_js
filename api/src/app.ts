import express from "express";
import cors from "cors";

import { Request, Response } from "express";
import {databaseManager} from "@/db/database_manager";

export const app = express();
app.use(cors());
app.use(express.json());

app.get("/tasks", async (req: Request, res: Response) => {
    const db = await databaseManager.getInstance();
    const result = await db.all("SELECT * FROM tasks");
    res.json(result);
  });


app.post('/tasks', async (req, res) => {
    const newTask = req.body;
    console.log(newTask);

    // ここでデータベースに新しいタスクを保存するロジックを実装
    const db = await databaseManager.getInstance();
    // データベースに新しいタスクを保存
    const sql = 'INSERT INTO tasks (title, status) VALUES (?, ?)';
    await db.run(sql, [newTask.title, newTask.status]);

    res.status(201).json(newTask);  // 保存したタスクをレスポンスとして返す
});