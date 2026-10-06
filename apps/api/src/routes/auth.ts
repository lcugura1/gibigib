import type { FastifyInstance } from "fastify";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
} from "@gibigib/types";
import { byEmail, byIp, limitRequests } from "../plugins/rate-limit";
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
  const limitLoginPerIp = limitRequests(app, "login-ip", { max: 50, timeWindow: "15 minutes", key: byIp });
  const limitLoginPerEmail = limitRequests(app, "login-email", { max: 10, timeWindow: "15 minutes", key: byEmail });
  const limitRegister = limitRequests(app, "register", { max: 10, timeWindow: "1 hour", key: byIp });
  const limitForgotPerIp = limitRequests(app, "forgot-ip", { max: 20, timeWindow: "1 hour", key: byIp });
  const limitForgotPerEmail = limitRequests(app, "forgot-email", { max: 3, timeWindow: "1 hour", key: byEmail });
  const limitReset = limitRequests(app, "reset", { max: 20, timeWindow: "15 minutes", key: byIp });

  app.post("/register", { preHandler: [limitRegister] }, async (request, reply) => {
    const input = registerSchema.parse(request.body);
    const user = await registerUser(input);
    const accessToken = await reply.jwtSign({
      userId: user.id,
      role: user.role,
    });
    const { token: refreshToken } = await issueRefreshToken(user.id);
    return reply.code(201).send({ user, accessToken, refreshToken });
  });

  app.post("/login", { preHandler: [limitLoginPerIp, limitLoginPerEmail] }, async (request, reply) => {
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

  app.post(
    "/forgot-password",
    { preHandler: [limitForgotPerIp, limitForgotPerEmail] },
    async (request, reply) => {
      const input = forgotPasswordSchema.parse(request.body);
      await requestPasswordReset(input.email);
      return reply.send({ message: "Ako račun postoji, poslali smo upute na e-adresu" });
    },
  );

  app.post("/reset-password", { preHandler: [limitReset] }, async (request, reply) => {
    const input = resetPasswordSchema.parse(request.body);
    await resetPassword(input);
    return reply.send({ message: "Lozinka je promijenjena" });
  });

  app.get("/me", { preHandler: [app.authenticate] }, async (request) => {
    return getUserById(request.user.userId);
  });
}
