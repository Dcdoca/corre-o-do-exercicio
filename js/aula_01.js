console.log('Application is running')

const input = document.querySelector('#task')
const button = document.querySelector("#button_create")
const ul = document.querySelector(".task-list")

const DB_KEY = "@test"

const STORAGE_SERVICE = {
  listTasks: () => {
    const storage = localStorage.getItem(DB_KEY);

    if (storage) {
      return JSON.parse(storage)
    }

    return []
  },

  createTask: (taskDescription) => {
    const storage = localStorage.getItem(DB_KEY);

    const newTask = {
      description: taskDescription,
      isCompleted: false,
    }

    if (storage) {
      const storageParsed = JSON.parse(storage)

      const tasks = [...storageParsed, newTask]

      return localStorage.setItem(DB_KEY, JSON.stringify(tasks))
    }

    return localStorage.setItem(DB_KEY, JSON.stringify([newTask]))
  },
  deleteTask: (taskDescription) => {
    const storage = localStorage.getItem(DB_KEY);

    if (storage) {
      const storageParsed = JSON.parse(storage)

      const filterdTasks = storageParsed.filter(item => item.description !== taskDescription)

      return localStorage.setItem(DB_KEY, JSON.stringify(filterdTasks))
    }

    return alert('Task not found');
  },
  updateTaskState: (taskDescription) => {
    const storage = localStorage.getItem(DB_KEY);

    if (storage) {
      const storageParsed = JSON.parse(storage)

      const updatedTask = storageParsed.map(item => {
        if (item.description === taskDescription) {
          return {
            ...item,
            isCompleted: !item.isCompleted
          }
        }

        return item
      })

      return localStorage.setItem(DB_KEY, JSON.stringify(updatedTask))
    }

    return alert('Task not found');
  }
}

document.addEventListener('DOMContentLoaded', () => updateActivityList())

button.addEventListener('click', (event) => {
  event.preventDefault();

  if (!input.value) {
    return alert('A tarefa precisa ser preenchida')
  }


  STORAGE_SERVICE.createTask(input.value)

  updateActivityList()
})

const updateStateTask = (event) => {
  const input = event.target
  const description = input.value

  STORAGE_SERVICE.updateTaskState(description);
}


const createTaskItem = (task) => {
  let checkbox = `<input type="checkbox" onChange="updateStateTask(event)" value=${task.description} `

  if (task.isCompleted) {
    checkbox += 'checked'
  }

  checkbox += '>'

  const li = `<li class="task-item">
    ${checkbox}
    <p>${task.description}</p>
  </li>`

  return li
}

const updateActivityList = () => {
  const emptyState = document.querySelector('.empty');
  const counterTasks = document.querySelector('.count-task');
  const counterTasksCompleted = document.querySelector('.count-finisheds');
console.log(emptyState )
  emptyState.innerHTML = ''
 emptyState.style.display = 'none'
  

  const tasks = STORAGE_SERVICE.listTasks();

  const countTasks = tasks.length;
  const countTasksCompleted = tasks.filter(item => item.isCompleted === true).length;

  counterTasks.textContent = countTasks;
  counterTasksCompleted.textContent = countTasksCompleted;

  ul.innerHTML = '';

  if (tasks.length === 0) {
    emptyState.style.display = 'block';
    emptyState.innerHTML = '<p>Sem tarefas.</p>';
    return;
  }

  for (let task of tasks) {
    ul.innerHTML += createTaskItem(task)
  }
}
