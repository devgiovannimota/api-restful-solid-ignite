import { IGymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface GymCreateUseCaseRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface GymCreateUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymsRepository: IGymsRepository) {}
  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: GymCreateUseCaseRequest): Promise<GymCreateUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });
    return { gym };
  }
}
