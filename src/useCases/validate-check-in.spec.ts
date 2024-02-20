import { inMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ValidateCheckInUseCase } from "./validate-check-ins";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { LateCheckInValidationError } from "./errors/late-checkin-validation-error";

let checkInRepository: inMemoryCheckInsRepository;
let validateCheckInUseCase: ValidateCheckInUseCase;

describe("Validate Check-in use case", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  beforeEach(async () => {
    vi.useFakeTimers();
    checkInRepository = new inMemoryCheckInsRepository();
    validateCheckInUseCase = new ValidateCheckInUseCase(checkInRepository);
  });

  it("should be able to validate check in", async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await validateCheckInUseCase.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should not be able to validate an inexistent check in", async () => {
    expect(() =>
      validateCheckInUseCase.execute({ checkInId: "Inexistent-check-in-id" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should not be able to validate the checkin after 20 minutes of its creations", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 16, 40));

    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
