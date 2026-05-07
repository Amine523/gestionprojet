export interface ApiResponse {
  status: string;
  desc: string;
  model?: string;
}

export interface ApiParam {
  name: string;
  type: string;
  description: string;
}

export interface ApiEndpoint {
  method: string;
  path: string;
  summary: string;
  params?: ApiParam[];
  body?: string;
  responses: ApiResponse[];
}

export interface ApiResource {
  name: string;
  description: string;
  endpoints: ApiEndpoint[];
}

export interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
}
