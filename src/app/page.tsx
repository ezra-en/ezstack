"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";

export default function Home() {
  const tasks = useQuery(api.tasks.getAllTasks);
  const toggleTask = useMutation(api.tasks.toggleTask);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {tasks?.map(({ _id, text, isCompleted }) => (
        <Card
          key={_id}
          className="w-full max-w-md mb-4 p-4 flex flex-row items-center gap-4"
        >
          <Checkbox
            id={`checkbox-${_id}`}
            checked={isCompleted}
            onCheckedChange={async (checked) => await toggleTask({ _id, isCompleted: checked === true })}
          />
          <label
            htmlFor={`checkbox-${_id}`}
            className="cursor-pointer select-none"
          >
            {text}
          </label>
        </Card>
      ))}
    </main>
  );
}
