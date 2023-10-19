const routes = require("express").Router();

routes.get("/", (req: any, res: any) => {
    res.send("ohio !");
});


export default routes;
