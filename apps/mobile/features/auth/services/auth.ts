import type { LoginInput, RegisterInput } from "@gibigib/types";
import { API_URL } from "@/shared/config";

export class ApiError extends Error {
  status?: number;
  issues?: { path: (string | number)[]; message: string }[];

  constructor(status?: number, message?: string, issues?: ApiError["issues"]) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

async function post(path: string, body: unknown) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message ?? "Došlo je do pogreške",
      data.issues,
    );
  }

  return data;
}

export function login(input: LoginInput) {
  return post("/auth/login", input);
}

export function register(input: RegisterInput) {
  return post("/auth/register", input);
}
