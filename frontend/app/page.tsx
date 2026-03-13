"use client";

import { useEffect, useState, useCallback } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchTasks();
    };

    loadData();
  }, [fetchTasks]);

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      await fetch(
        `http://127.0.0.1:8000/tasks?title=${encodeURIComponent(newTaskTitle)}&description=Açıklama`,
        {
          method: "POST",
        },
      );
      setNewTaskTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Ekleme hatası:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`http://127.0.0.1:8000/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/tasks/${task.id}?completed=${!task.completed}`,
        {
          method: "PUT",
        },
      );
      fetchTasks();
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 py-12 px-4 text-slate-900">
      <div className="max-w-2xl mx-auto">
        {/* Üst Başlık ve İstatistik */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Smart Task Hub
          </h1>
          <p className="text-slate-500 font-medium">
            {tasks.length} aktif görev içinden{" "}
            {tasks.filter((t) => t.completed).length} tanesi tamamlandı
          </p>
        </div>

        {/* Modern Ekleme Kutusu */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm p-2 flex gap-2 border border-white mb-8 focus-within:shadow-indigo-100 focus-within:border-blue-300 transition-all duration-300">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Bugün ne yapacaksın?"
            className="flex-1 bg-transparent rounded-xl px-5 py-3 outline-none text-lg font-light"
          />
          <button
            onClick={addTask}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 active:scale-95 transition-all"
          >
            Ekle
          </button>
        </div>

        {/* Görev Listesi */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-slate-300">
              <p className="text-slate-400 text-lg">
                Liste henüz boş, yeni bir başlangıç yap!
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center gap-5">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                      className="w-6 h-6 rounded-full border-2 border-slate-300 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer appearance-none"
                    />
                    {task.completed && (
                      <span className="absolute left-1.5 text-white pointer-events-none text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-lg transition-all duration-300 ${
                      task.completed
                        ? "text-slate-400 line-through opacity-60"
                        : "text-slate-700 font-medium"
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
                  title="Görevi Sil"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="CS19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
