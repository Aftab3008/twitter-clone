"use server";

import { connectToDatabase } from "../database";
import Notification from "../database/models/notifications.model";
import { handleError } from "../utils";

export async function createNotification(
  from: string,
  to: string,
  type: string,
  message?: string
) {
  try {
    await connectToDatabase();
    const notification = await Notification.create({
      from,
      to,
      type,
      message,
    });
    return JSON.parse(JSON.stringify(notification));
  } catch (error) {
    handleError(error);
  }
}
