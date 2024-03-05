import { Prisma, Role, User } from "@prisma/client";
import { IUsersRepository } from "../users-repository";
import { randomUUID } from "node:crypto";

export class inMemoryUsersRepository implements IUsersRepository {
  public items: User[] = [];
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      role: data.role || "MEMBER",
      password_hash: data.password_hash,
      created_at: new Date(),
    };
    this.items.push(user);
    return user;
  }
  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }
    return user;
  }
  async findById(id: string) {
    const user = this.items.find((item) => item.id === id);

    if (!user) {
      return null;
    }
    return user;
  }
}
