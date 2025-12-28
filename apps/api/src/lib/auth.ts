// Authentication utilities
// For now, we'll use a simple user ID from headers
// In production, this would validate JWT tokens

export function getUserIdFromRequest(c: any): string {
  // In production, extract from JWT token
  // For now, use a header or default user
  const userId = c.req.header("X-User-Id");
  return userId || "user_123456789"; // Default user for development
}

export function requireAuth(c: any): string {
  const userId = getUserIdFromRequest(c);
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

