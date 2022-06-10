/**
 * IIFE
 * MVVM architecture pattern
 */


const APIs = (() => {
    const URL = "http://localhost:3000/todos";
    
    const getTodos = () => {
        return fetch(`${URL}`)
          .then(res => {
            return res.json()
        })
    }

    const addTodo = (newTodo) => {
        return fetch(`${URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newTodo)
        }).then(res => {
            return res.json()
        })
    }

    return {
        getTodos,
        addTodo,
    }



})();

const Model = (() => {
    class State {
        // private field
        #todos
        #onChangeCb
        constructor(){
            this.#todos = []
            this.#onChangeCb = () => {}
        }

        get todos() {
            return this.#todos
        }

        set todos(newTodos) {
            this.#todos = newTodos;
            this.#onChangeCb();
        }

        subscribe = (cb) => {
            this.#onChangeCb = cb;
        }
    }
    console.log(this)
    return {
        State
    }
})();


const View = (() => {
    const formEl = document.querySelector(".todo__form")
    const todoListEl = document.querySelector(".todo__list")  // the <ul> element


    const renderTodoList = (todos) => {
        let template = "";
        todos.forEach((todo) => {
            template += `
            <li><span>${todo.content}</span><button class="btn--delete">Delete</button></li>
            `
        })
        todoListEl.innerHTML = template;
    }
    return {
        formEl,
        todoListEl,
        renderTodoList
    }

})();


const ViewModel = ((Model, View) => {
    const state = new Model.State();

    const addTodo = () => {
        View.formEl.addEventListener("submit", (event) => {
            event.preventDefault();
            const content = event.target[0].value;
            if(content.trim() === "") return;
            const newTodo = { content: content }
            APIs.addTodo(newTodo).then(data => {
                state.todos = [data, ...state.todos]
            }) 

        })
    }

    const getTodo = () => {
        APIs.getTodos().then(data => {
            state.todos = data;
        })
    }

    const bootstrap = () => {
        getTodo();
        addTodo();
        state.subscribe(() => {
            View.renderTodoList(state.todos)
        })
    }

    return {
        bootstrap
    }
})(Model, View);

ViewModel.bootstrap();
