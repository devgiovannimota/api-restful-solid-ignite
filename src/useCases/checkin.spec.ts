import { CheckInUseCase } from "@/useCases/checkin";
import { inMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let checkInRepository: inMemoryCheckInsRepository;
let checkInUseCase: CheckInUseCase;

describe("Check-in use case", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  beforeEach(() => {
    vi.useFakeTimers();
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

  it("should be not to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    await expect(() =>
      checkInUseCase.execute({
        gymId: "gym-01",
        userId: "user-01",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be not to check in twice but in diferent days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));
    const { checkIn } = await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    expect(checkIn.id).toBe(expect.any(String));
  });
});
