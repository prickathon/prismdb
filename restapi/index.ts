import * as express from 'express'
import routes from "./routes"

const app = express();
app.set('json spaces', 2)
app.use("/", routes);
app.listen(4567, () => {
    console.log(`listening on 4567`);
});