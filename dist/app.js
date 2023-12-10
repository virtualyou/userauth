"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const index_1 = __importDefault(require("./models/index"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const express_session_1 = __importDefault(require("express-session"));
const process = __importStar(require("process"));
const initIndex = process.argv.indexOf("--init=true");
const init = initIndex !== -1;
const app = (0, express_1.default)();
dotenv.config();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(
  (0, express_session_1.default)({
    secret: "your-secret-key-here",
    resave: false,
    saveUninitialized: true,
  })
);
app.get("/", (_req, res) => {
  res.send("Welcome to the VirtuaYou UserAuth API.");
});
const Role = index_1.default.role;
if (init) {
  index_1.default.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and Resync Db");
    initial();
  });
} else {
  index_1.default.sequelize.sync();
}
app.use(auth_routes_1.default);
app.use(user_routes_1.default);
function initial() {
  Role.create({
    id: 1,
    name: "owner",
  });
  Role.create({
    id: 2,
    name: "agent",
  });
  Role.create({
    id: 3,
    name: "monitor",
  });
  Role.create({
    id: 4,
    name: "admin",
  });
}
exports.default = app;
//# sourceMappingURL=app.js.map
