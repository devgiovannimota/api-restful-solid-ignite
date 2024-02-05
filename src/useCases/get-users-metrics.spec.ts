import { inMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserMetricsUseCase } from "./get-user-matrics";

let checkInRepository: inMemoryCheckInsRepository;
let getUserMetricsUseCase: GetUserMetricsUseCase;

describe("Get user metrics", () => {
  beforeEach(async () => {
    checkInRepository = new inMemoryCheckInsRepository();
    getUserMetricsUseCase = new GetUserMetricsUseCase(checkInRepository);
  });

  it("Should be able to get check-ins counts from metrics", async () => {
    await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await checkInRepository.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: "user-01",
    });

    expect(checkInsCount).toEqual(2);
  });
});
