"use client";

import { TestComponent } from "@/components/test-component";

export default function TestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Тестовая страница</h1>
      <TestComponent />
    </div>
  );
}