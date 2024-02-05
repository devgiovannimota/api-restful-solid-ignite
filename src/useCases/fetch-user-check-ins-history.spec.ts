import { inMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

let checkInRepository: inMemoryCheckInsRepository;
let fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase;

describe("Fetch Check-In History use case", () => {
  beforeEach(async () => {
    checkInRepository = new inMemoryCheckInsRepository();
    fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
      checkInRepository
    );

    // await gymsRepository.create({
    //   id: "gym-01",
    //   title: "academia",
    //   description: "",
    //   phone: "",
    //   latitude: -27.0747279,
    //   longitude: -49.6401091,
    // });
  });

  it("should be able to fetch check-in history", async () => {
    await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });
    await checkInRepository.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });
    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: "user-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ]);
  });

  it("should be able to fetch paginated check-in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-01",
      });
    }
    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: "user-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
