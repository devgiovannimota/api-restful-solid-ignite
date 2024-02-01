import { inMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserProfileUseCase } from "./get-user-profile";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/resource-not-found";

let userRepository: inMemoryUsersRepository;
let getUserProfileUseCase: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    userRepository = new inMemoryUsersRepository();
    getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
  });

  it("Should be to get user profile", async () => {
    const createdUser = await userRepository.create({
      name: "Giovanni Mota",
      email: "gigi@hotmail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await getUserProfileUseCase.execute({
      userId: createdUser.id,
    });
    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("Giovanni Mota");
  });

  it("Should not be able to get user profile with wrong id", async () => {
    expect(() =>
      getUserProfileUseCase.execute({
        userId: "non-existing-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
