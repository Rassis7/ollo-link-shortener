import { HTTP_STATUS_CODE } from "@/helpers";
import { FastifyInstance, FastifyReply } from "fastify";

export async function heathCheckRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/",
    handler: (_, reply: FastifyReply) => {
      return reply.code(HTTP_STATUS_CODE.OK).send({ status: "OK" });
    },
  });
}
