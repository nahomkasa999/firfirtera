import crypto from 'crypto';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
  console.warn('TELEGRAM_BOT_TOKEN is not set. Authentication will fail.');
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface ParsedInitData {
  user?: TelegramUser;
  auth_date: number;
  hash: string;
  [key: string]: any;
}

/**
 * Verify Telegram WebApp initData
 * @param initData - The initData string from Telegram WebApp
 * @returns Parsed and verified user data, or null if verification fails
 */
export function verifyTelegramWebAppData(initData: string): TelegramUser | null {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not configured');
    return null;
  }

  if (!initData || initData.trim().length === 0) {
    return null;
  }

  try {
    // Parse initData
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    
    if (!hash) {
      return null;
    }

    // Remove hash from params for verification
    params.delete('hash');

    // Sort parameters alphabetically
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create secret key from bot token
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(TELEGRAM_BOT_TOKEN)
      .digest();

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Verify hash
    if (calculatedHash !== hash) {
      console.error('Invalid Telegram initData hash');
      return null;
    }

    // Check auth_date (should be within 24 hours)
    const authDate = params.get('auth_date');
    if (authDate) {
      const authTimestamp = parseInt(authDate, 10);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const timeDiff = currentTimestamp - authTimestamp;
      
      // Allow 24 hours (86400 seconds) for auth_date
      if (timeDiff > 86400) {
        console.error('Telegram initData expired');
        return null;
      }
    }

    // Parse user data
    const userStr = params.get('user');
    if (!userStr) {
      return null;
    }

    const user: TelegramUser = JSON.parse(userStr);
    return user;
  } catch (error) {
    console.error('Error verifying Telegram initData:', error);
    return null;
  }
}

/**
 * Extract user ID from initData header
 * @param request - Next.js request object
 * @returns Telegram user ID or null
 */
export function getTelegramUserId(request: Request): string | null {
  const initData = request.headers.get('X-Telegram-Init-Data');
  if (!initData) {
    return null;
  }

  const user = verifyTelegramWebAppData(initData);
  return user ? String(user.id) : null;
}

