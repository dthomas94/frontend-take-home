type AppData = {
  users: User[];
  roles: Role[];
};

type User = {
  id: string;
  createdAt: string;
  updatedAt: string;
  first: string;
  last: string;
  roleId: string;
  photo?: string;
};

type Role = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string;
  isDefault: boolean;
};

export { type AppData, type User, type Role };
