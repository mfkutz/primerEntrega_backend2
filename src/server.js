import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";
import productsView from "./routes/products.view.js";
import __dirname from "./dirname.js";
import path from "path";
import morgan from "morgan";
import websocket from "./websocket/ws.products.js";
import cookieParser from "cookie-parser";
/* import MongoStore from "connect-mongo"; */
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
/* import session from "express-session"; */
import sessionRoutes from "./routes/session.routes.js";
import viewRoutes from "./routes/session.views.js";
import { config } from "dotenv";

config();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser()); //cookie no firmada

/* app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: "mongodb://localhost:27017/primerentrega",
      ttl: 260,
    }),
  })
); */

//Passport
initializePassport();
app.use(passport.initialize());

mongoose
  .connect("mongodb://localhost:27017/primerentrega")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(express.static(path.resolve(__dirname, "../public")));

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/", productsView);
app.use("/api/sessions", sessionRoutes);
app.use("/", viewRoutes);
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

const httpserver = app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);

const io = new Server(httpserver);
websocket(io);
