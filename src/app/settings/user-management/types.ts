// Shared types for user management
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  access: string[];
  currency: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  permissions: any[];
}

// Interface for creating/editing users (without system fields)
export interface CreateUserData {
  name: string;
  position: string;
  email: string;
  password: string;
  access: string;
  country: string;
  currency: string;
  role: string;
} 