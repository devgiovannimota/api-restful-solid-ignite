import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";
import { beforeEach, describe, expect, it } from "vitest";

let gymRepository: InMemoryGymRepository;
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase;

describe("Fetch Nearby gyms Use Case", () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository();
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymRepository);
  });

  it("Should be able to fetch nearby gyms", async () => {
    await gymRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.640191,
    });
    await gymRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -27.0610928,
      longitude: -49.5229501,
    });

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.640191,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
