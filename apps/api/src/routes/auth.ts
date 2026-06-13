import type { FastifyInstance } from "fastify";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
} from "@gibigib/types";
import {
  getUserById,
  issueRefreshToken,
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  revokeRefreshToken,
  rotateRefreshToken,
} from "../services/auth";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const input = registerSchema.parse(request.body);
    const user = await registerUser(input);
    const accessToken = await reply.jwtSign({
      userId: user.id,
      role: user.role,
    });
    const { token: refreshToken } = await issueRefreshToken(user.id);
    return reply.code(201).send({ user, accessToken, refreshToken });
  });

  app.post("/login", async (request, reply) => {
    const input = loginSchema.parse(request.body);
    const user = await loginUser(input);
    const accessToken = await reply.jwtSign({
      userId: user.id,
      role: user.role,
    });
    const { token: refreshToken } = await issueRefreshToken(user.id);
    return reply.send({ user, accessToken, refreshToken });
  });

  app.post("/refresh", async (request, reply) => {
    const { refreshToken } = refreshTokenSchema.parse(request.body);
    const { user, refreshToken: newRefreshToken } =
      await rotateRefreshToken(refreshToken);
    const accessToken = await reply.jwtSign({
      userId: user.id,
      role: user.role,
    });
    return reply.send({ user, accessToken, refreshToken: newRefreshToken });
  });

  app.post("/logout", async (request, reply) => {
    const { refreshToken } = refreshTokenSchema.parse(request.body);
    await revokeRefreshToken(refreshToken);
    return reply.code(204).send();
  });

  app.post("/forgot-password", async (request, reply) => {
    const input = forgotPasswordSchema.parse(request.body);
    await requestPasswordReset(input.email);
    return reply.send({ message: "Ako račun postoji, poslali smo upute na e-adresu" });
  });

  app.post("/reset-password", async (request, reply) => {
    const input = resetPasswordSchema.parse(request.body);
    await resetPassword(input);
    return reply.send({ message: "Lozinka je promijenjena" });
  });

  app.get("/me", { preHandler: [app.authenticate] }, async (request) => {
    return getUserById(request.user.userId);
  });
}
