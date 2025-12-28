import { OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import type {
  MessagesListData,
  ChatDetailData,
  ChatMessage,
} from "@repo/shared/types";
import { prisma } from "../db/client.js";
import { requireAuth } from "../lib/auth.js";
import { v4 as uuidv4 } from "uuid";
import { prismaMessageToChatMessage } from "../db/helpers.js";

const messagesRoute = new OpenAPIHono();

// Format last message time
function formatLastMessageTime(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return timestamp.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return timestamp.toLocaleDateString("en-US", {
      weekday: "short",
    });
  } else {
    return timestamp.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
}

// Get messages list
messagesRoute.openapi(
  {
    method: "get",
    path: "/messages",
    summary: "Get messages list",
    description: "Returns list of current and past meal chats",
    tags: ["Messages"],
    responses: {
      200: {
        description: "Messages list",
        content: {
          "application/json": {
            schema: z.any(),
          },
        },
      },
    },
  },
  async (c) => {
    const userId = requireAuth(c);
    const now = new Date();

    // Get meals where user is involved
    const userMeals = await prisma.meal.findMany({
      where: {
        OR: [
          { host: { userId } },
          { joinedUsers: { some: { name: { contains: userId } } } },
        ],
      },
      include: {
        host: true,
        joinedUsers: true,
        messages: {
          orderBy: { timestamp: "desc" },
          take: 1,
          include: {
            sender: true,
          },
        },
      },
    });

    const currentEvent: any[] = [];
    const pastEvents: any[] = [];

    for (const meal of userMeals) {
      if (meal.messages.length === 0) continue;

      const lastMessage = meal.messages[0];
      const participants = [
        {
          userId: meal.host.userId,
          name: meal.host.name,
          profilePicture: meal.host.profilePicture,
        },
        ...meal.joinedUsers.map((u: any) => ({
          userId: "", // TODO: Map joined users to actual user IDs
          name: u.name,
          profilePicture: u.profilePicture,
        })),
      ];

      const chat = {
        mealId: meal.mealId,
        mealName: meal.mealname || "Companion Meal",
        mealPicture: meal.mealpicture || undefined,
        participants,
        lastMessage: {
          senderName: lastMessage.sender.name,
          content: lastMessage.content,
          timestamp: lastMessage.timestamp,
        },
        formattedLastMessageTime: formatLastMessageTime(lastMessage.timestamp),
        isActive: meal.mealtime > now,
        unreadCount: 0, // TODO: Calculate unread count
      };

      if (meal.mealtime > now) {
        currentEvent.push(chat);
      } else {
        pastEvents.push(chat);
      }
    }

    const messagesList: MessagesListData = {
      currentEvent,
      pastEvents,
    };

    return c.json(messagesList);
  }
);

// Get chat detail
messagesRoute.openapi(
  {
    method: "get",
    path: "/messages/{mealId}",
    summary: "Get chat detail",
    description: "Returns chat messages and participant info for a meal",
    tags: ["Messages"],
    request: {
      params: z.object({
        mealId: z.string().describe("Meal ID"),
      }),
    },
    responses: {
      200: {
        description: "Chat detail",
        content: {
          "application/json": {
            schema: z.any(),
          },
        },
      },
      404: {
        description: "Meal not found",
      },
    },
  },
  async (c) => {
    const userId = requireAuth(c);
    const { mealId } = c.req.valid("param");

    const meal = await prisma.meal.findUnique({
      where: { mealId },
      include: {
        host: true,
        joinedUsers: true,
        messages: {
          orderBy: { timestamp: "asc" },
          include: {
            sender: true,
          },
        },
      },
    });

    if (!meal) {
      return c.json({ error: "Meal not found" }, 404);
    }

    const participants = [
      {
        userId: meal.host.userId,
        name: meal.host.name,
        profilePicture: meal.host.profilePicture,
      },
      ...meal.joinedUsers.map((u: any) => ({
        userId: "", // TODO: Map to actual user IDs
        name: u.name,
        profilePicture: u.profilePicture,
      })),
    ];

    const messages = meal.messages.map((msg: any) =>
      prismaMessageToChatMessage(msg, userId)
    );

    const chatDetail: ChatDetailData = {
      mealId: meal.mealId,
      mealName: meal.mealname || "Companion Meal",
      participants,
      messages,
    };

    return c.json(chatDetail);
  }
);

// Send message
const sendMessageSchema = z.object({
  content: z.string().min(1),
});

messagesRoute.openapi(
  {
    method: "post",
    path: "/messages/{mealId}",
    summary: "Send a message",
    description: "Sends a message to a meal chat",
    tags: ["Messages"],
    request: {
      params: z.object({
        mealId: z.string().describe("Meal ID"),
      }),
      body: {
        content: {
          "application/json": {
            schema: sendMessageSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Message sent",
        content: {
          "application/json": {
            schema: z.object({
              messageId: z.string(),
              message: z.string(),
            }),
          },
        },
      },
      404: {
        description: "Meal not found",
      },
    },
  },
  async (c) => {
    const userId = requireAuth(c);
    const { mealId } = c.req.valid("param");
    const { content } = c.req.valid("json");

    const meal = await prisma.meal.findUnique({
      where: { mealId },
    });

    if (!meal) {
      return c.json({ error: "Meal not found" }, 404);
    }

    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const messageId = `msg_${uuidv4()}`;
    await prisma.message.create({
      data: {
        messageId,
        mealId,
        senderId: userId,
        content,
      },
    });

    return c.json(
      {
        messageId,
        message: "Message sent",
      },
      201
    );
  }
);

export default messagesRoute;
