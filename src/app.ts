import express, { Application, json } from "express";
import { startDatabase } from "./database";
import { deleteMovie, getMovie, patchMovie, postMovie } from "./functions";
import { middlewareGetDataBase } from "./middlewares";

const app: Application = express();
app.use(json());

app.post("/movies", middlewareGetDataBase, postMovie);
app.get("/movies", getMovie);
app.delete("/movies/:id", deleteMovie);
app.patch("/movies/:id", middlewareGetDataBase, patchMovie);

const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;
app.listen(PORT, async () => {
  await startDatabase();
  console.log(runningMsg);
});
