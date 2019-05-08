import { Router } from "express";
import Sparql from "../middleware/sparqle"
import { sortInstanceList, filterInstanceList } from '../middleware/util'

const router = Router();

const className = `Episode`
const arrayParameters = {
    'livePerformed': 'lives'
}
const sortBy = [ "episodeOfSeries", "話数" ]

router.get("/", async (req, res) => {
    const results = await Sparql.getInstanceList(className, arrayParameters)
    const filterdResult= filterInstanceList(results, req.query)
    const sortedResults = sortInstanceList(filterdResult, sortBy)
    res.json({
        results: sortedResults
    })
})

router.get("/:key", async (req, res) => {
    const key = req.params.key
    const properties = await Sparql.getInstance(key, className, arrayParameters)
    res.json(properties)
})

export default router;
