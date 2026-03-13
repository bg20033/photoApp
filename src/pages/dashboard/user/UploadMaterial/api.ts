import { type StorageData, type User } from "./types";

export async function fetchStorageData(): Promise<StorageData[]> {
  return [
    {
      id: "1",
      userId: "u1",
      userName: "John Doe",
      userEmail: "john@example.com",
      totalGB: 100,
      usedGB: 45,
      remainingGB: 55,
      expirationDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "active",
    },
    {
      id: "2",
      userId: "u2",
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      totalGB: 50,
      usedGB: 48,
      remainingGB: 2,
      expirationDate: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "expiring-soon",
    },
    {
      id: "3",
      userId: "u3",
      userName: "Bob Wilson",
      userEmail: "bob@example.com",
      totalGB: 200,
      usedGB: 200,
      remainingGB: 0,
      expirationDate: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "expired",
    },
  ];
}

export async function fetchUsers(): Promise<User[]> {
  return [
    { id: "u1", name: "John Doe", email: "john@example.com" },
    { id: "u2", name: "Jane Smith", email: "jane@example.com" },
    { id: "u3", name: "Bob Wilson", email: "bob@example.com" },
    { id: "u4", name: "Alice Brown", email: "alice@example.com" },
  ];
}
    