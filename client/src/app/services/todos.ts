import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export enum TodoStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}

export enum TodoPriority {
    NONE = 'NONE',
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export interface Todo {
    id: number;
    title: string;
    description?: string;
    status: TodoStatus;
    category?: string;
    priority: TodoPriority;
}

export interface CreateTodoDto {
    title: string;
    description?: string;
    category?: string;
    priority: TodoPriority;
    status: TodoStatus;
}

@Injectable({
    providedIn: 'root'
})
export class TodosService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/todos';

    getTodos() {
        return this.http.get<Todo[]>(this.apiUrl);
    }

    createTodo(todo: CreateTodoDto) {
        return this.http.post<Todo>(this.apiUrl, todo);
    }

    updateTodo(id: number, changes: Partial<Todo>) {
        return this.http.patch<Todo>(`${this.apiUrl}/${id}`, changes);
    }

    deleteTodo(id: number) {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}