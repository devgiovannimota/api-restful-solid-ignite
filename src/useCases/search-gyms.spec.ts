import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymRepository: InMemoryGymRepository;
let searchGymsUseCase: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository();
    searchGymsUseCase = new SearchGymsUseCase(gymRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymRepository.create({
      title: "Javascript Gym",
      description: null,
      phone: null,
      latitude: -27.0747279,
      longitude: -49.4889672,
    });
    await gymRepository.create({
      title: "Typescript Gym",
      description: null,
      phone: null,
      latitude: -27.0747279,
      longitude: -49.4889672,
    });
    const { gyms } = await searchGymsUseCase.execute({
      query: "Javascript",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Javascript Gym" }),
    ]);
  });

  it("Should be able to fetch paginated gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        title: `Javascript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -27.0747279,
        longitude: -49.4889672,
      });
    }
    const { gyms } = await searchGymsUseCase.execute({
      query: "Javascript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Javascript Gym 21" }),
      expect.objectContaining({ title: "Javascript Gym 22" }),
    ]);
  });
});
