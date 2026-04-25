export interface AgentResponse {
  success: boolean;
  data: any;
  message: string;
}

export abstract class BaseAgent {
  protected async generateResponse(prompt: string): Promise<string> {
    // Placeholder for LLM response - replace with Claude API call
    console.log('Generating response for:', prompt);
    return `Mock LLM response for prompt: ${prompt.substring(0, 100)}...`;
  }

  protected async generateStructuredResponse(prompt: string, schema: any): Promise<any> {
    // Placeholder for structured LLM response using Zod
    console.log('Generating structured response for:', prompt);
    const mockData = {
      id: 'mock-' + Date.now(),
      name: 'Generated Item',
      data: 'Structured mock data',
      timestamp: new Date().toISOString()
    };
    return schema ? schema.parse(mockData) : mockData;
  }

  protected createResponse(success: boolean, data: any, message: string): AgentResponse {
    return {
      success,
      data,
      message
    };
  }

  abstract execute(input: any): Promise<AgentResponse>;
}

