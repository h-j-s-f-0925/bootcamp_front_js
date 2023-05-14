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

export class ApplicationForm  {
  start = async (): Promise<void> => {
    async function saveToDB(taskTitle: string, status: string) {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskTitle,
          status: status === 'todo' ? 1 : 0,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        console.log(`Task saved: ${taskTitle}`);
      }
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
      
      const form = document.querySelector('.form') as HTMLFormElement;
      console.log(form);
      if (form) {
        form.addEventListener('submit', (event) => {
          event.preventDefault();  // フォームのデフォルトの送信を防ぐ
      
          const input = document.querySelector('.form__title') as HTMLInputElement;
          console.log(input);
          if (input) {
            const taskTitle = input.value;
            if (taskTitle) {
              addTask(taskTitle, 'todo');
              saveToDB(taskTitle, 'todo');
            }
            input.value = '';  // 入力フィールドをリセット
          } else {
            console.error('Could not find input element with class .form__title');
          }
        });
      } else {
        console.error('Could not find form with class .form');
      }
  };
} 