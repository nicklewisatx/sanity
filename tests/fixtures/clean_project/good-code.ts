// This file has no issues - well formatted and no lint errors

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

export function findUserById(id: number): User | undefined {
  return users.find((user) => user.id === id);
}

export function addUser(user: User): void {
  users.push(user);
  console.log(`Added user: ${user.name}`);
}

// All variables are used, proper const usage, no any types
const MAX_USERS = 100;

export function canAddMoreUsers(): boolean {
  return users.length < MAX_USERS;
}
