import axios from "axios";
import tough from "tough-cookie";
import axiosCookieJarSupport from "axios-cookiejar-support";

axiosCookieJarSupport(axios);

export class TestClient {
  url: string;
  options: {
    jar: tough.CookieJar;
    withCredentials: boolean;
  };

  constructor(url: string) {
    this.url = url;
    this.options = {
      jar: new tough.CookieJar(),
      withCredentials: true,
    };
  }

  async login(email: string, password: string) {
    return axios.post(
      this.url,
      {
        query: `
        mutation {
            login(email: "${email}", password: "${password}") {
              path
              message
            }
          }
        `,
      },
      { ...this.options }
    );
  }

  async logout() {
    return axios.post(
      this.url,
      {
        query: `
        mutation {
            logout
        }
        `,
      },
      { ...this.options }
    );
  }

  async register(email: string, password: string) {
    return axios.post(
      this.url,
      {
        query: `
        mutation {
          register(email: "${email}", password: "${password}") {
            path
            message
          }
        }
      `,
      },
      { ...this.options }
    );
  }

  async user() {
    return axios.post(
      this.url,
      {
        query: `
        query {
            user {
              id
              email
            }
          }
        `,
      },
      { ...this.options }
    );
  }
}
