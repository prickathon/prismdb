import * as express from 'express'
import routes from "./routes"

const app = express();
app.use("/api", routes);
app.listen(4567, () => {
    console.log(`listening on 4567`);
});