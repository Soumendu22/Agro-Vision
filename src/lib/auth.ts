export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { id: string };
  } catch {
    return null;
  }
} 