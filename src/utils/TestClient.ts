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

  async changeForgottenPassword(newPassword: string, key: string) {
    const response = await axios.post(
      this.url,
      {
        query: `
        mutation {
          changeForgottenPassword(newPassword: "${newPassword}", key: "${key}") {
            path
            message
          }
        }
        `,
      },
      { ...this.options }
    );

    return response.data.data;
  }

  async login(email: string, password: string) {
    const response = await axios.post(
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

    return response.data.data;
  }

  async logout() {
    const response = await axios.post(
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

    return response.data.data;
  }

  async register(email: string, password: string) {
    const response = await axios.post(
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

    return response.data.data;
  }

  async user() {
    const response = await axios.post(
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

    return response.data.data;
  }
}
