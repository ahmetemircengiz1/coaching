import prisma from "@coach-os/database";

export type NotificationType =
  | "check_in"
  | "program_assigned"
  | "nutrition_assigned"
  | "feedback"
  | "security_alert"
  | "guest_signup"
  | "guest_converted";

export async function createNotification(data: {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) {
  return prisma.notification.create({
    data: {
      recipientId: data.recipientId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link || null,
    },
  });
}

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({
    where: { recipientId: userId, isRead: false },
  });
}

export async function getNotifications(userId: string, limit = 20) {
  return prisma.notification.findMany({
    where: { recipientId: userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function markNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { recipientId: userId, isRead: false },
    data: { isRead: true },
  });
}

export async function markNotificationAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}
