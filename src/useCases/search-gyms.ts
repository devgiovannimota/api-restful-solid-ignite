import { IGymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface SearchGymUseCaseRequest {
  query: string;
  page: number;
}

interface SearchGymUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  constructor(private gymRepository: IGymsRepository) {}
  async execute({
    query,
    page,
  }: SearchGymUseCaseRequest): Promise<SearchGymUseCaseResponse> {
    const gyms = await this.gymRepository.searchMany(query, page);
    return { gyms };
  }
}
