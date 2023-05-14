export class Application  {
  start = async (): Promise<void> => {
      const response = await fetch("http://localhost:3000/tasks");
      if (!response.ok) throw new Error("fetch tasks failed");
      const tasks = (await response.json()) as Array<Tasks>;
      console.log(tasks);

      const taskList = document.querySelector('.task-list');
      if (taskList) {
        taskList.innerHTML = '';
      } else {
        console.error('Could not find element with class .task-list');
      }

      
      function addTask(taskTitle: string, status: string) {
        // <li>タグを作成
        const task = document.createElement('li');
        task.className = 'task task--' + status;
      
        // <div class="task__btn">を作成
        const taskBtn = document.createElement('div');
        taskBtn.className = 'task__btn';
        task.appendChild(taskBtn);  // task要素に追加
      
        // <div class="task__title">を作成
        const taskTitleDiv = document.createElement('div');
        taskTitleDiv.setAttribute('data-test', 'task-title');
        taskTitleDiv.className = 'task__title';
        taskTitleDiv.textContent = taskTitle;  // taskのタイトルを設定
        task.appendChild(taskTitleDiv);  // task要素に追加
      
        // 最後に、作成したtaskを<ul>タグ内に追加
        const taskList = document.querySelector('.task-list');
        if (taskList) {
          taskList.appendChild(task);
        } else {
          console.error('Could not find element with class .task-list');
        }
      }
      
      // タスクを追加
      for (const task of tasks) {
        if (task.status === 1) {
          addTask(task.title, 'todo');
        } else if (task.status === 0) {
          addTask(task.title, 'done');
        }
      }
  };
} 

export type Tasks = {
  title: string;
  status: number;
};
