"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
const joi_1 = __importDefault(require("joi"));
dotenv.config({
    path: path_1.default.resolve(__dirname, '../../.env')
});
const envSchema = joi_1.default.object().keys({
    NODE_ENV: joi_1.default.string().valid('production', 'development', 'test').required(),
    PORT: joi_1.default.string().required().default('3006'),
    SERVER_URL: joi_1.default.string().required().default('http://localhost'),
    DB_HOST: joi_1.default.string().required().default('localhost'),
    DB_USER: joi_1.default.string().required().default('root'),
    DB_PASSWORD: joi_1.default.string().required().default('mariadbAdmin123'),
    DB_SCHEMA: joi_1.default.string().required().default('virtualyou'),
});
const { value: validatedEnv, error } = envSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env, { abortEarly: false, stripUnknown: true });
if (error) {
    throw new Error(`Environment variable validation error: \n${error.details
        .map((detail) => detail.message)
        .join('\n')}`);
}
const config = {
    node_env: validatedEnv.NODE_ENV,
    server: {
        port: validatedEnv.PORT,
        url: validatedEnv.SERVER_URL
    },
    database: {
        host: validatedEnv.DB_HOST,
        user: validatedEnv.DB_USER,
        password: validatedEnv.DB_PASSWORD,
        db: validatedEnv.DB_SCHEMA,
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
};
exports.default = config;
//# sourceMappingURL=config.js.map