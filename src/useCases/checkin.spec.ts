import { CheckInUseCase } from "@/useCases/checkin";
import { inMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInError } from "./errors/max-numbers-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInRepository: inMemoryCheckInsRepository;
let gymsRepository: InMemoryGymRepository;
let checkInUseCase: CheckInUseCase;

describe("Check-in use case", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  beforeEach(async () => {
    vi.useFakeTimers();
    checkInRepository = new inMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymRepository();
    checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "academia",
      description: "",
      phone: "",
      latitude: -27.0747279,
      longitude: -49.6401091,
    });
  });

  it("should be able to check in", async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.0747279,
      userLongitude: -49.6401091,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should be not to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.0747279,
      userLongitude: -49.6401091,
    });

    await expect(() =>
      checkInUseCase.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -27.0747279,
        userLongitude: -49.6401091,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInError);
  });

  it("should be not to check in twice but in diferent days", async () => {
    vi.setSystemTime(new Date(2022, 0, 25, 8, 0, 0));
    await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.0747279,
      userLongitude: -49.6401091,
    });

    vi.setSystemTime(new Date(2022, 0, 10, 8, 0, 0));
    const { checkIn } = await checkInUseCase.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.0747279,
      userLongitude: -49.6401091,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "academia",
      description: "",
      phone: "",
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    });

    await expect(() =>
      checkInUseCase.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
