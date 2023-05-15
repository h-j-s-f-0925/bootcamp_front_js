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

app.put('/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const newStatus = req.body.status;
    console.log(taskId);
    console.log(newStatus);
  
    try {
      const db = await databaseManager.getInstance();
      const sql = 'UPDATE tasks SET status = ? WHERE id = ?';
      await db.run(sql, [newStatus, taskId]);
  
      res.status(200).json({ message: 'Task status updated' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task status' });
    }
  });

  app.delete('/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    console.log(taskId);
    console.log(parseInt(taskId));
    try {
      const db = await databaseManager.getInstance();
      const sql = 'DELETE FROM tasks WHERE id = ?';
      await db.run(sql, [parseInt(taskId)]);
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });
  