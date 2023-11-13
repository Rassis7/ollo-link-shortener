import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";

const server = Fastify();

server.register(fastifyJwt, () => ({
  secret: String(process.env.FASTIFY_JWT_SECREET),
}));

server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      return reply.send(error);
    }
  }
);

server.get("/healthcheck", async () => {
  return { status: "OK" };
});

export { server };
