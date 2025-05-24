export interface User {
    id?: number;
    name: string;
    email: string;
    roles: Array<string>;
    password :string;
    active?: boolean;    
  }