export interface Lead {
  name: string;
  email: string;
  phone: string;
  message?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

