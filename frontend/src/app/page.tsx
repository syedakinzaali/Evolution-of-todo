'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 1. ADD THIS LINE HERE (The Search State)
  const [searchQuery, setSearchQuery] = useState(''); // <--- CHANGE

  const API_URL = 'http://127.0.0.1:8000';

  // 2. UPDATE THIS FUNCTION (Added the search parameter)
  const fetchTodos = async () => {
    try {
      setLoading(true);
      // We added `?search=${searchQuery}` to the end of the URL below
      const response = await fetch(`${API_URL}/todos/?search=${searchQuery}`); // <--- CHANGE
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    try {
      const response = await fetch(`${API_URL}/todos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodoTitle, completed: false }),
      });
      if (response.ok) {
        const newTodo = await response.json();
        setTodos([...todos, newTodo]);
        setNewTodoTitle('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      const response = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Todo List</h1>

      <form onSubmit={addTodo} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 p-2 border rounded text-black"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      {/* 3. ADD THIS SECTION HERE (The Search Bar UI) */}
      <div className="flex gap-2 mb-8 p-4 bg-gray-100 rounded">
        <input 
          type="text" 
          placeholder="Search tasks..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border rounded text-black"
        />
        <button 
          onClick={fetchTodos} 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold"
        >
          Search
        </button>
      </div> 
      {/* --- END OF SEARCH BAR --- */}

      {loading ? (
        <p>Loading todos...</p>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                  className="w-5 h-5"
                />
                <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                  {todo.title}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
          {todos.length === 0 && <p className="text-gray-500 text-center">No todos found!</p>}
        </ul>
      )}
    </main>
  );
}