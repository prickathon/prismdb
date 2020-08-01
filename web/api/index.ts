import express from 'express';
import routes from "./routes"

const app = express();
app.set('json spaces', 2)
app.use("/", routes);
// app.listen(process.env.PORT || 4567, () => {
//     console.log(`listening on ${process.env.PORT || 4567}`);
// });
module.exports = app
