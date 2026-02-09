
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo, TodosService, TodoStatus, TodoPriority, CreateTodoDto } from '../../services/todos';

@Component({
    selector: 'app-todos',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './todos.html',
    styleUrl: './todos.scss'
})
export class Todos implements OnInit {
    private todosService = inject(TodosService);

    todos = signal<Todo[]>([]);

    public TodoStatus = TodoStatus;
    public TodoPriority = TodoPriority;

    newTodo: CreateTodoDto = this.getEmptyTodo();

    ngOnInit() {
        this.loadTodos();
    }

    loadTodos() {
        // todosservice returns an observable (data stream). need to subscribe to trigger async http reqs. runs request and listens for response
        // next if successful (200), error if failed (400/500)
        this.todosService.getTodos().subscribe({
            next: (data) => this.todos.set(data),
            error: (err) => console.error('Failed to load todos', err)
        });
    }

    addTodo() {
        if (!this.newTodo.title.trim()) return;

        this.todosService.createTodo(this.newTodo).subscribe({
            next: (newItem) => {
                this.todos.update(list => [...list, newItem]);
                this.newTodo = this.getEmptyTodo();
            },
            error: (err) => console.error('Failed to create todo', err)
        });
    }

    updateStatus(todo: Todo, newStatus: string) {
        const newStatusEnum = newStatus as TodoStatus;

        // optimistic ui update - we update frontend before request. only revert if server fails to update.
        this.todos.update(list => list.map(t => t.id === todo.id ? { ...t, status: newStatusEnum } : t));
        this.todosService.updateTodo(todo.id, { status: newStatusEnum }).subscribe({
            error: (err) => {
                this.loadTodos();
                console.error('Failed to update todo status', err);
            }
        });
    }

    deleteTodo(id: number) {
        if (!confirm('Are you sure?')) return;
        // can do optimistic update here too
        this.todosService.deleteTodo(id).subscribe({
            next: () => {
                this.todos.update(list => list.filter(t => t.id !== id));
            },
            error: (err) => console.error('Failed to delete todo', err)
        });
    }

    private getEmptyTodo(): CreateTodoDto {
        return {
            title: '',
            description: '',
            category: '',
            priority: TodoPriority.NONE,
            status: TodoStatus.PENDING
        };
    }
}