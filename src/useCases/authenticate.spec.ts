import { expect, describe, it } from "vitest";
import { hash } from "bcryptjs";
import { inMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalide-credentials=erros";

describe("Authenticate use case", () => {
  it("Should be able to authenticate", async () => {
    const userRepository = new inMemoryUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(userRepository);
    await userRepository.create({
      id: "users-2",
      name: "Giovanni Mota",
      password_hash: await hash("123456", 6),
      email: "lala@hotmail.com",
      created_at: new Date(),
    });

    const { user } = await authenticateUseCase.execute({
      email: "lala@hotmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Should not be able to authenticate with wrong email", async () => {
    const userRepository = new inMemoryUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(userRepository);
    await userRepository.create({
      id: "users-2",
      name: "Giovanni Mota",
      password_hash: await hash("123456", 6),
      email: "lala@hotmail.com",
      created_at: new Date(),
    });

    expect(() =>
      authenticateUseCase.execute({
        email: "teste@hotmail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

it("Should not be able to authenticate with wrong password", async () => {
  const userRepository = new inMemoryUsersRepository();
  const authenticateUseCase = new AuthenticateUseCase(userRepository);
  await userRepository.create({
    name: "Giovanni Mota",
    password_hash: await hash("123456", 6),
    email: "lala@hotmail.com",
  });

  expect(() =>
    authenticateUseCase.execute({
      email: "lala@hotmail.com",
      password: "123453",
    })
  ).rejects.toBeInstanceOf(InvalidCredentialsError);
});
