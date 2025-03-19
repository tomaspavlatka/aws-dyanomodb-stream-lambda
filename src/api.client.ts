import axios, { AxiosHeaders, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";


export class ApiClient {
  private client: AxiosInstance;

  constructor(
    private readonly baseUrl: string,
    private readonly headers: AxiosHeaders,
    private readonly authToken: string
  ) {
    this.client = this.createClient();
  }

  async request<T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client({
      method,
      url,
      data,
    });

    return response.data;
  };

  private createClient(): AxiosInstance {
    const config: AxiosRequestConfig = {
      baseURL: this.baseUrl,
      headers: {
        ...this.headers,
        Authorization: `Bearer ${this.authToken}`,
      }
      ,
    }

    return axios.create(config);
  }
}
