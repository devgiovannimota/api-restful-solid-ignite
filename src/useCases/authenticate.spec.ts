import { expect, describe, it, beforeAll, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { inMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalide-credentials=erros";

let userRepository: inMemoryUsersRepository;
let authenticateUseCase: AuthenticateUseCase;

describe("Authenticate use case", () => {
  beforeEach(() => {
    userRepository = new inMemoryUsersRepository();
    authenticateUseCase = new AuthenticateUseCase(userRepository);
  });
  it("Should be able to authenticate", async () => {
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
