export interface User {
    id: number;
    username: string;
    email: string;
    roles: Array<string>;
    password :string;
    firstTime: boolean;
    active: boolean;
  }