export class LangflowClient {
  private baseURL: string;
  private apiKey?: string;

  constructor(baseURL: string, apiKey?: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  async ping() {
    const response = await fetch(`${this.baseURL}/api/v1/health`);
    if (!response.ok) {
      throw new Error('Langflow server is not responding');
    }
    return await response.json();
  }

  async post(endpoint: string, body: any, headers: Record<string, string> = {"Content-Type": "application/json"}) {
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }
    const url = `${this.baseURL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorBody}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Request Error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to connect to Langflow server: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }

  async runFlow(flowId: string, inputValue: string) {
    const endpoint = `/api/v1/run/${flowId}?stream=false`;
    const body = {
      input_value: inputValue,
      output_type: "chat",
      input_type: "chat",
      tweaks: {
        "AstraVectorStoreComponent-CoU2r": {},
        "ParseData-RCafH": {},
        "Prompt-ztpxW": {},
        "NVIDIAEmbeddingsComponent-1CzhI": {},
        "GoogleGenerativeAIModel-KosLo": {},
        "TextInput-40ald": {},
        "TextOutput-FPEeC": {}
      }
    };
    const response = await this.post(endpoint, body);
    console.log('Response:', response.outputs[0].outputs[0].artifacts.text.repr);
    if (response && response.outputs && response.outputs.length > 0 &&
        response.outputs[0].outputs && response.outputs[0].outputs.length > 0 &&
        response.outputs[0].outputs[0].artifacts && response.outputs[0].outputs[0].artifacts.text) {
      return response.outputs[0].outputs[0].artifacts.text.repr;
    }
    throw new Error('Unexpected response format from Langflow server');
  }
}
