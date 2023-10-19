import errorHandler from "errorhandler";
import app from "./app";


app.use(errorHandler());

const server = app.listen(app.get("port"), () => {
    console.log(
        "Express Server is running at PORT %d in %s mode",
        app.get("port"),
        app.get("env")
    );
});

export default server;
