export interface User {
    id: number;
    email: string;
    roles: Array<string>;
    password :string;
    firstTime: boolean;
    active: boolean;
  }