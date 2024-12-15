import Pusher from "pusher";
import PusherClient from "pusher-js";

// Server-Side Pusher Instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: process.env.PUSHER_APP_CLUSTER!,
  useTLS: true, // Ensures secure connections
});

// Client-Side Pusher Instance
export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
});