const server = require("../api/server");
const request = require("supertest");

describe("server.js module", () => {
  it("has the right environment for the DB_ENV ", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
    
    
    


//   it("should return a 200 OK", () => {
//     return request(server)
//       .get("/api/users")
//       .expect(200);
//   });

  it("returns the proper content type for the post request ", () => {
    return request(server)
      .post("/api/auth/login")
      .expect("Content-Length", "34");
  });

  it("returns the right content length on delete request ", () => {
    return request(server)
      .post("/api/auth/login")
      .expect("Content-Type", /json/);
  });

//   it("returns the right body for the delete request", () => {
//     return request(server)
//       .delete("/api/users/14")
//       .expect({
//         removed: 1
//       });
//   });
});
