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

export class ApplicationStatusUpdate {
  // ステータス更新処理を開始するメソッド
  start = (): void => {
    this.addClickListeners(); // クリックイベントのリスナーを設定
  };

  // クリックイベントのリスナーを設定するメソッド
  addClickListeners = (): void => {
    const taskList = document.querySelector('.task-list'); // タスクリストの要素を取得
    if (!taskList) return; // タスクリストが存在しない場合は処理を終了

    taskList.addEventListener('click', (event) => {
      const target = event.target as HTMLElement; // イベントの発生元の要素を取得
      if (!target.classList.contains('task__btn')) return; // クリックされた要素がチェックマークでない場合は処理を終了

      event.preventDefault(); // イベントのデフォルトの挙動をキャンセル

      const task = target.closest('.task'); // クリックされた要素の親要素であるタスク要素を取得
      if (!task) return; // タスク要素が存在しない場合は処理を終了

      const newStatus = task.classList.contains('task--done') ? 'todo' : 'done'; // タスクの現在のステータスを取得し、逆のステータスに切り替える
      task.classList.toggle('task--done', newStatus === 'done'); // タスク要素のクラス名に 'task--done' を付与または削除する

      console.log(`Task status updated. New status: ${newStatus}`); // コンソールに新しいステータスを表示
    });
  };

  updateTaskStatus = async (taskId: number, newStatus: string): Promise<void> => {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus === 'done' ? 1 : 0,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      console.log(`Task status updated. New status: ${newStatus}`);
    }
  };
}

export class ApplicationDelete {
  private taskContainer: HTMLElement | null;

  constructor() {
    this.taskContainer = document.querySelector('.task-list');
  }

  start = (): void => {
    this.addClearButtonListener();
  };

  addClearButtonListener(): void {
    const clearButton = document.querySelector('.clear__btn');
    if (!clearButton || !this.taskContainer) return;

    clearButton.addEventListener('click', async () => {
      console.log('Clear button clicked');
      await this.clearDoneTasks();
    });
  }

  clearDoneTasks = async (): Promise<void> => {
    if (!this.taskContainer) return;

    const doneTasks = this.taskContainer.querySelectorAll('.task.task--done');
    doneTasks.forEach(async (task, index) => {
      const taskId = `${index + 1}`;
      await this.deleteTaskFromDatabase(taskId);
      task.remove();
    });
  };

  deleteTaskFromDatabase = async (taskId: string): Promise<void> => {
    try {
      // サーバーサイドのAPIを呼び出してデータベースからタスクを削除する
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task from the database.');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
}

