import { Router, Request, Response } from "express";
import character from "./character";
import episode from "./episode";
import song from "./song";
import live from "./live";
import series from "./series";

const routes = Router();

routes.use("/character", character);
routes.use("/episode", episode);
routes.use("/song", song);
routes.use("/live", live);
routes.use("/series", series);

export default routes;