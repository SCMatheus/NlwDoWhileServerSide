import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService";

class WebAuthenticateUserController {
  async handle(request: Request, response: Response) {
    const { code } = request.body;
    const service = new AuthenticateUserService();

    try {
      const result = await service.execute(code, true);
      return response.json(result);
    }catch(err) {
      return response.json({error: err.message })
    }
  }
}

export { WebAuthenticateUserController }