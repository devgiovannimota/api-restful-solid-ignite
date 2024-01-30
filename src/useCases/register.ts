import { prisma } from "@/lib/prisma";
import { IUsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error("Email already exists");
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
