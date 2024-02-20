import { IGymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface FetchNearbyGymUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyGymUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private gymRepository: IGymsRepository) {}
  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymUseCaseRequest): Promise<FetchNearbyGymUseCaseResponse> {
    const gyms = await this.gymRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });
    return { gyms };
  }
}
