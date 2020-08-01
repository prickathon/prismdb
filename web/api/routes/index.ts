import { Router, Request, Response } from "express";
import character from "./character";
import episode from "./episode";
import song from "./song";
import live from "./live";
import series from "./series";
import shop from "./shop";

const routes = Router();

routes.use("/character", character);
routes.use("/episode", episode);
routes.use("/song", song);
routes.use("/live", live);
routes.use("/series", series);
routes.use("/shop", shop);

export default routes;