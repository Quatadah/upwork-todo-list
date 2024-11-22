"use client";

import AddTaskModal from "@/components/AddTaskModal";
import TaskList from "@/components/TaskList";
import { sortTasks } from "@/lib/utils";
import { Task } from "@/types";
import { Button, Input, Kbd } from "@nextui-org/react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const storedTasks = localStorage.getItem("tasks");
      return storedTasks ? JSON.parse(storedTasks) : [];
    }
    return [];
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddTask = (newTask: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, task]);
    setIsAddModalOpen(false);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id
          ? { ...updatedTask, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const filteredTasks = tasks
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => sortTasks(a, b, sortOrder));

  return (
    <main className="min-h-screen">
      <div className="container max-w-4xl px-4 py-8 mx-auto">
        <div className="p-6 space-y-6 border shadow-lg bg-card rounded-xl backdrop-blur-sm border-border/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
              Upwork todo list
            </h1>
            <Button
              onPress={() => setIsAddModalOpen(true)}
              color="primary"
              variant="shadow"
              startContent={<PlusIcon className="w-4 h-4" />}
            >
              Add Task
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Input
              ref={searchInputRef}
              placeholder="Search tasks..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<SearchIcon className="text-default-400" size={20} />}
              endContent={
                <Kbd keys={["command"]} className="hidden md:inline-block">
                  K
                </Kbd>
              }
              className="flex-1"
            />
            <Button
              variant="bordered"
              onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              Sort {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>

          <TaskList
            tasks={filteredTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />

          <AddTaskModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddTask}
          />
        </div>
      </div>
    </main>
  );
}