"use client";

import { Task } from "@/types";
import { Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import DeleteTaskModal from "./DeleteTaskModal";
import EditTaskModal from "./EditTaskModal";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-default-500">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="transition-shadow hover:shadow-md">
          <CardBody>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold">{task.title}</h3>
                {task.description && (
                  <p className="mb-4 whitespace-pre-wrap text-default-500">
                    {task.description}
                  </p>
                )}
                <div className="flex gap-4 text-sm text-default-400">
                  <span>
                    Created at {moment(task.createdAt).format("DD/MM/YYYY")}
                  </span>
                  <span>
                    Last updated at {moment(task.updatedAt).format("DD/MM/YYYY")}
                  </span  >
                </div>
              </div>
              <div className="flex">
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly variant="light">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Task actions">
                    <DropdownItem
                      key="edit"
                      startContent={<Edit2 className="w-4 h-4" />}
                      onPress={() => setEditingTask(task)}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      startContent={<Trash2 className="w-4 h-4" />}
                      onPress={() => setDeletingTaskId(task.id)}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onEdit={onEdit}
        />
      )}

      <DeleteTaskModal
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={() => {
          if (deletingTaskId) {
            onDelete(deletingTaskId);
            setDeletingTaskId(null);
          }
        }}
      />
    </div>
  );
}