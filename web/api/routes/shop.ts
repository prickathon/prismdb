import { Router } from "express";
import Sparql from "../middleware/sparql"
import { sortInstanceList, filterInstanceList } from '../middleware/util'

const router = Router();

const className = `Shop`
const arrayParameters = {}
const sortBy:string[] = []

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
    const properties = await Sparql.getInstance(className, key, arrayParameters)
    res.json(properties)
})

export default router;
