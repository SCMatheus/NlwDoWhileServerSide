import { Router } from "express";
import { WebAuthenticateUserController } from "./controller/WebAuthenticateUserController";
import { AppAuthenticateUserController } from "./controller/AppAuthenticateUserController";
import { CreateMessageController } from "./controller/CreateMessageController";
import { GetLast3MessagesController } from "./controller/GetLast3MessagesController";
import { ProfileUserController } from "./controller/ProfileUserController";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

const router = Router();

router.post("/web/authenticate", new WebAuthenticateUserController().handle)

router.post("/app/authenticate", new AppAuthenticateUserController().handle)

router.post("/messages", ensureAuthenticated, new CreateMessageController().handle)

router.get("/messages/last3", new GetLast3MessagesController().handle)

router.get("/profile", ensureAuthenticated, new ProfileUserController().handle)

export { router }