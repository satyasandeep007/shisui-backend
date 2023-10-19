const routes = require("express").Router();

routes.get("/", (req: any, res: any) => {
    res.send("ohio !");
});

routes.get("/verify", (req: any, res: any) => {
    const { telegramId } = req.params
    res.send("Verfied!" + telegramId);
});

export default routes;
