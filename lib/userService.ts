import { PrismaClient } from '@prisma/client';
import { verifyTelegramWebAppData } from './auth';

/**
 * Get or create user from Telegram authentication
 * @param prisma - Prisma client instance
 * @param request - Next.js request object
 * @returns User telegramId or null if authentication fails
 */
export async function getAuthenticatedUserId(
  prisma: PrismaClient,
  request: Request
): Promise<string | null> {
  const initData = request.headers.get('X-Telegram-Init-Data');
  if (!initData) {
    return null;
  }

  const telegramUser = verifyTelegramWebAppData(initData);
  if (!telegramUser) {
    return null;
  }

  const telegramId = String(telegramUser.id);

  // Create or update user in database
  try {
    await prisma.user.upsert({
      where: { telegramId },
      update: {
        username: telegramUser.username || null,
        firstName: telegramUser.first_name || null,
      },
      create: {
        telegramId,
        username: telegramUser.username || null,
        firstName: telegramUser.first_name || null,
      },
    });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    // Continue even if user creation fails - return the ID anyway
  }

  return telegramId;
}

