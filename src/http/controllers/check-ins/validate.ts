import { makeValidateCheckInUseCase } from "@/useCases/factories/make-validate-check-in-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();
  const { checkIn } = await validateCheckInUseCase.execute({
    checkInId,
  });

  return reply.status(201).send(checkIn);
}
