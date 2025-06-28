import "server-only";

export const token = process.env.SANITY_API_READ_TOKEN;

// Only throw error if token is accessed, not when module is imported
export function getToken() {
  if (!token) {
    throw new Error("Missing SANITY_API_READ_TOKEN");
  }
  return token;
}
