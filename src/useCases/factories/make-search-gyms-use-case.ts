import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchGymsUseCase } from "../search-gyms";

export function makeSearchGymsUseCase() {
  const gymRepository = new PrismaGymsRepository();
  const searchGymUseCase = new SearchGymsUseCase(gymRepository);
  return searchGymUseCase;
}
