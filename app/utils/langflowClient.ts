export class LangflowClient {
  private baseURL: string;
  private apiKey?: string;

  constructor(baseURL: string, apiKey?: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
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
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Request Error:', error);
      throw error;
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
    return response.outputs[0].outputs[0].outputs.message.message.text;
  }
}
