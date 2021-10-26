import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService";

class AppAuthenticateUserController {
  async handle(request: Request, response: Response) {
    const { code } = request.body;
    const service = new AuthenticateUserService();

    try {
      const result = await service.execute(code, false);
      return response.json(result);
    }catch(err) {
      return response.json({error: err.message })
    }
  }
}

export { AppAuthenticateUserController }