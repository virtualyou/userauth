/*
 *
 * VirtualYou Project
 * Copyright 2023 David L Whitehurst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * endpoints.test.ts
 */

import request from "supertest";
import app from "../src/app";

// happy path
describe("Test Signup", () => {
  it("POST /userauth/v1/auth/signup", async () => {
    const userSuffixNum = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    const newuser = "bob" + userSuffixNum;

    const response = await request(app)
      .post("/userauth/v1/auth/signup")
      .send({
        username: newuser,
        email: newuser + "@yahoo.com",
        password: "abc123",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "User registered successfully!" });
  });
});

// unhappy path
describe("Test Signup ... Existing email", () => {
  it("POST /userauth/v1/auth/signup", async () => {
    const newuser = "bobo";

    const response = await request(app)
        .post("/userauth/v1/auth/signup")
        .send({
          username: newuser,
          email: "owner@yahoo.com",
          password: "abc123",
        });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "Failed! Email is already in use!" });
  });
});

// unhappy path
describe("Test Signup ... Existing user", () => {
  it("POST /userauth/v1/auth/signup", async () => {
    const existinguser = "owner";

    const response = await request(app)
        .post("/userauth/v1/auth/signup")
        .send({
          username: existinguser,
          email: "bobo@yahoo.com",
          password: "abc123",
        });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "Failed! Username is already in use!" });
  });
});

// unhappy path
describe("Test Signup ... No username in Body", () => {
  it("POST /userauth/v1/auth/signup", async () => {

    const response = await request(app)
        .post("/userauth/v1/auth/signup")
        .send({
          email: "someone@yahoo.com",
          password: "abc123",
        });
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });
});

// unhappy path
describe("Test Signup ... incorrect Role sent", () => {
  it("POST /userauth/v1/auth/signup", async () => {
    const userSuffixNum = Math.floor(Math.random() * (999 - 100 + 1) + 100);
    const newuser = "bob" + userSuffixNum;

    const response = await request(app)
        .post("/userauth/v1/auth/signup")
        .send({
          username: newuser,
          email: newuser + "@yahoo.com",
          password: "abc123",
          ownerId: 0,
          roles: ["delivery"]
        });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "Failed! Role does not exist." });
  });
});

// happy path
describe("Test Signin", () => {
  it("POST /userauth/v1/auth/signin", async () => {
    const response = await request(app).post("/userauth/v1/auth/signin").send({
      username: "owner",
      password: "abc123",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
  });
});

// happy path
describe("Test Signout", () => {
  it("POST /userauth/v1/auth/signout", async () => {
    const response = await request(app).post("/userauth/v1/auth/signout").send({
      username: "owner",
      password: "abc123",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "You've been signed out!" });
  });
});

describe("Test public endpoint with no authentication or authorization", () => {
  it("GET /userauth/v1/all", async () => {
    const response = await request(app).get("/userauth/v1/all");
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toContain("Public Content.");
  });
});

describe("Test Owner dashboard request with JWT", () => {
  let cookie: string[] = [];
  const agent = request.agent(app);

  beforeAll(async () => {
    const response = await agent.post("/userauth/v1/auth/signin").send({
      username: "owner",
      password: "abc123",
    });
    cookie = response.get("Set-Cookie");
  });

  afterAll(async () => {
    await agent.post("/userauth/v1/auth/signout").send({
      username: "owner",
      password: "abc123",
    });
  });

  it("GET /userauth/v1/owner", async () => {
    const response2 = await agent.get("/userauth/v1/owner").set(cookie);
    expect(response2.statusCode).toBe(200);
    expect(response2.type).toBe("text/html");
    expect(response2.text).toContain("Owner dashboard for signed in user.");
  });
});

describe("Test Agent dashboard request with JWT", () => {
  let cookie: string[] = [];
  const agent = request.agent(app);

  beforeAll(async () => {
    const response = await agent.post("/userauth/v1/auth/signin").send({
      username: "agent",
      password: "abc123",
    });
    cookie = response.get("Set-Cookie");
  });

  afterAll(async () => {
    await agent.post("/userauth/v1/auth/signout").send({
      username: "agent",
      password: "abc123",
    });
  });

  it("GET /userauth/v1/agent", async () => {
    const response3 = await agent.get("/userauth/v1/agent").set(cookie);
    expect(response3.statusCode).toBe(200);
    expect(response3.type).toBe("text/html");
    expect(response3.text).toContain("Agent dashboard for signed in user.");
  });
});

describe("Test Monitor dashboard request with JWT", () => {
  let cookie: string[] = [];
  const agent = request.agent(app);

  beforeAll(async () => {
    const response = await agent.post("/userauth/v1/auth/signin").send({
      username: "monitor",
      password: "abc123",
    });
    cookie = response.get("Set-Cookie");
  });

  afterAll(async () => {
    await agent.post("/userauth/v1/auth/signout").send({
      username: "monitor",
      password: "abc123",
    });
  });

  it("GET /userauth/v1/monitor", async () => {
    const response4 = await agent.get("/userauth/v1/monitor").set(cookie);
    expect(response4.statusCode).toBe(200);
    expect(response4.type).toBe("text/html");
    expect(response4.text).toContain("Monitor dashboard for signed in user.");
  });
});

describe("Test Admin dashboard request with JWT", () => {
  let cookie: string[] = [];
  const agent = request.agent(app);

  beforeAll(async () => {
    const response = await agent.post("/userauth/v1/auth/signin").send({
      username: "admin",
      password: "abc123",
    });
    cookie = response.get("Set-Cookie");
  });

  afterAll(async () => {
    await agent.post("/userauth/v1/auth/signout").send({
      username: "admin",
      password: "abc123",
    });
  });

  it("GET /userauth/v1/admin", async () => {
    const response4 = await agent.get("/userauth/v1/admin").set(cookie);
    expect(response4.statusCode).toBe(200);
    expect(response4.type).toBe("text/html");
    expect(response4.text).toContain("Admin dashboard for signed in user.");
  });
});

// unhappy path
describe("Test unauthorized", () => {
  let cookie: string[] = [];
  const agent = request.agent(app);

  beforeAll(async () => {
    const response = await agent.post("/userauth/v1/auth/signin").send({
      username: "admin",
      password: "abc123",
    });
    cookie = response.get("Set-Cookie");
  });

  afterAll(async () => {
    await agent.post("/userauth/v1/auth/signout").send({
      username: "admin",
      password: "abc123",
    });
  });

  it("GET /userauth/v1/agent", async () => {
    const response2 = await agent.get("/userauth/v1/agent").set(cookie);
    expect(response2.statusCode).toBe(403);
    expect(response2.type).toBe("application/json");
    expect(response2.body).toEqual({"message": "Require Agent Role!"});
  });
});


// unhappy path
describe("Test no token provided", () => {
  const agent = request.agent(app);

  it("GET /userauth/v1/owner", async () => {
    const response = await agent.get("/userauth/v1/owner");
    expect(response.statusCode).toBe(403);
    expect(response.text).toContain("No token provided!");
  });
});

describe("Test admin resource for list of users", () => {
  let cookie: string[] = [];
  const agent = request.agent(app);

  beforeAll(async () => {
    const response = await agent.post("/userauth/v1/auth/signin").send({
      username: "admin",
      password: "abc123",
    });
    cookie = response.get("Set-Cookie");
  });

  it("GET /userauth/v1/users", async () => {
    const response4 = await agent.get("/userauth/v1/users").set(cookie);
    expect(response4.statusCode).toBe(200);
    expect(response4.type).toBe("application/json");
    expect(response4.body).toBeTruthy();
  });
});

/*
 * happy path
 */
describe("Test root path welcome", () => {
  const agent = request.agent(app);
  it("GET /", async () => {
    const response4 = await agent.get("/");
    expect(response4.statusCode).toBe(200);
    expect(response4.type).toBe("text/html");
    expect(response4.text).toContain("Welcome to the VirtuaYou UserAuth API.");
  });
});

/*
 * get roles for a user
 */
describe("Test roles for user", () => {
  let cookie: string[] = [];
  const agent = request.agent(app);

  beforeAll(async () => {
    const response = await agent.post("/userauth/v1/auth/signin").send({
      username: "admin",
      password: "abc123",
    });
    cookie = response.get("Set-Cookie");
  });

  it("GET /userauth/v1/users/1/roles", async () => {
    const response2 = await agent.get("/userauth/v1/users/1/roles").set(cookie);
    expect(response2.statusCode).toBe(200);
    expect(response2.type).toBe("application/json");
/*
    Received array: [
      {
        "createdAt": "2023-12-10T01:13:47.000Z",
        "updatedAt": "2023-12-10T01:13:47.000Z",
        "id": 1,
        "name": "owner",
        "user_roles": {
          "userId": 1
          "roleId": 1,
          "createdAt": "2023-12-10T01:14:14.000Z",
          "updatedAt": "2023-12-10T01:14:14.000Z",
         }
       }
     ]
 */
    for (let i = 0; i < response2.body.length; i++) {
      if (response2.body[i].name === "owner") {
        expect(response2.body[i].name).toEqual('owner');
      }
      if (response2.body[i].name === "agent") {
        expect(response2.body[i].name).toEqual('owner');
      }
      if (response2.body[i].name === "monitor") {
        expect(response2.body[i].name).toEqual('owner');
      }
      if (response2.body[i].name === "admin") {
        expect(response2.body[i].name).toEqual('admin');
      }
    }
  });
});
