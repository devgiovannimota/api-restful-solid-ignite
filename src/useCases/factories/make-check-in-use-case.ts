import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { CheckInUseCase } from "../checkin";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeCheckInUseCase() {
  const gymRepository = new PrismaGymsRepository();
  const checkInRepository = new PrismaCheckInsRepository();
  const checkInUseCase = new CheckInUseCase(checkInRepository, gymRepository);
  return checkInUseCase;
}
