import { Router } from "express";
import Sparql from "../middleware/sparqle"

const router = Router();

const className = `Series`
const classBaseUri = "https://prismdb.takanakahiko.me/rdfs/series/"
const arrayParameters = {
    'hasEpisode': 'episodes'
}

router.get("/", async (req, res) => {
    const keys = await Sparql.getKeys(className, classBaseUri)
    res.json({
        keys
    })
})

router.get("/:key", async (req, res) => {
    const key = req.params.key
    const properties = await Sparql.getProperties(key, classBaseUri, arrayParameters)
    res.json(properties)
})

export default router;
