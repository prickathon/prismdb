import { Router } from "express";
import character from "./character";
import episode from "./episode";
import live from "./live";
import series from "./series";
import shop from "./shop";
import song from "./song";

const routes = Router();

routes.use("/character", character);
routes.use("/episode", episode);
routes.use("/song", song);
routes.use("/live", live);
routes.use("/series", series);
routes.use("/shop", shop);

export default routes;
