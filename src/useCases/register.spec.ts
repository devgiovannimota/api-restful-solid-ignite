import { test, expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { inMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

let userRepository: inMemoryUsersRepository;
let registerUseCase: RegisterUseCase;

describe("Register use case", () => {
  beforeEach(() => {
    userRepository = new inMemoryUsersRepository();
    registerUseCase = new RegisterUseCase(userRepository);
  });

  it("Should be hash user password upon registration", async () => {
    const { user } = await registerUseCase.execute({
      name: "lala",
      email: "lala@hotmail.com",
      password: "123456",
    });
    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("Should not be able to register with same email twice", async () => {
    const email = "lala@hotmail.com";

    await registerUseCase.execute({
      name: "lala",
      email,
      password: "123456",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "lala",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
  it("Should be hash able to register", async () => {
    const { user } = await registerUseCase.execute({
      name: "lala",
      email: "lala@hotmail.com",
      password: "123456",
    });
    expect(user.id).toEqual(expect.any(String));
  });
});
