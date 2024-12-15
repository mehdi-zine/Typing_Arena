import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getRoomData(roomId: string) {
  // Query the Room model without the 'include' property
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  return room;
}