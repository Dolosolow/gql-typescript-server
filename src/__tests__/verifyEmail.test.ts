import fetch from "node-fetch";

describe("Confirm Email", () => {
  test("should return 'invalid' because of bad/expired id param being sent", async () => {
    const response = await fetch(`${process.env.TEST_HOST}/confirm/123u12413`);
    const text = await response.text();
    expect(text).toEqual("invalid");
  });
});
