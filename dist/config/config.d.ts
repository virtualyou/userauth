declare const config: {
  readonly node_env: any;
  readonly server: {
    readonly port: any;
    readonly url: any;
  };
  readonly database: {
    readonly host: any;
    readonly user: any;
    readonly password: any;
    readonly db: any;
    readonly dialect: "mysql";
    readonly pool: {
      readonly max: 5;
      readonly min: 0;
      readonly acquire: 30000;
      readonly idle: 10000;
    };
  };
};
export default config;
