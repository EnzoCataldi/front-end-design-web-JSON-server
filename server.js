const express = require("express"),
  cors = require("cors"),
  chokidar = require("chokidar"),
  jsonServer = require("json-server");

const fileName = "./data.js";
const port = 8080;

let router = undefined;

const app = express();

const createServer = () => {
  delete require.cache[require.resolve(fileName)];
  setTimeout(() => {
    router = jsonServer.router(fileName.endsWith(".js") ? require(fileName)() : fileName);
  }, 100);
};

createServer();

app.use(cors("*"));

app.get("/", (req, res) => {
  res.status(200).send("This is a JSON server");
});

app.use(jsonServer.bodyParser);
app.use("/api", (req, res, next) => router(req, res, next));

chokidar.watch(fileName).on("change", () => {
  console.log(`Reloading web service data...`);
  createServer();
  console.log(`Reloading web service data complete.`);
});

app.listen(port, () => console.log(`Web service is running on ${port}`));
