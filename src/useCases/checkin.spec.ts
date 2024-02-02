import { CheckInUseCase } from "@/useCases/checkin";
import { inMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";

let checkInRepository: inMemoryCheckInsRepository;
let checkInUseCase: CheckInUseCase;

describe("Check-in use case", () => {
  beforeEach(() => {
    checkInRepository = new inMemoryCheckInsRepository();
    checkInUseCase = new CheckInUseCase(checkInRepository);
  });

  it("should be able to check in", async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
