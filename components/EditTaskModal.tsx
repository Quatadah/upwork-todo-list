"use client";

import { Task } from "@/types";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { useState } from "react";

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export default function EditTaskModal({
  task,
  isOpen,
  onClose,
  onEdit,
}: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    onEdit({
      ...task,
      title: title.trim(),
      description: description.trim(),
    });
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader>Edit Task</ModalHeader>
            <ModalBody>
              <Input
                label="Title"
                placeholder="Enter task title"
                value={title}
                onValueChange={(value) => {
                  setTitle(value);
                  setError("");
                }}
                isInvalid={!!error}
                errorMessage={error}
                isRequired
              />
              <Textarea
                label="Description"
                placeholder="Enter task description (optional)"
                value={description}
                onValueChange={setDescription}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Save Changes
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}