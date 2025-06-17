import { Role, User } from "./utils/types";

const BASE_API_URL = "http://localhost:3002";

async function getUsers(q?: string) {
  try {
    const res = await fetch(
      `${BASE_API_URL}/users${q ? `?search=${q}` : ""}`,
      {}
    );

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const usersData = await res.json();
    return usersData.data as User[];
  } catch (err: any) {
    console.error(err.message);
    return [];
  }
}

async function getRoles() {
  try {
    const res = await fetch(`${BASE_API_URL}/roles`);

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const rolesData = await res.json();
    return rolesData.data as Role[];
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
}

// keep getting the "missing fields" error for all fields. Even tried sending data via Postman and the error still occurs
async function addUser(name: string) {
  const [first, last] = name.split(" ");
  const formData = new FormData();
  formData.append("first", first);
  formData.append("last", last);

  try {
    const res = await fetch(`${BASE_API_URL}/users`, {
      method: "POST",
      body: formData,
    });
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
}

async function deleteUser(id: string) {
  try {
    const res = await fetch(`${BASE_API_URL}/users/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const userData = await res.json();
    return userData as User;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
}

async function initApp() {
  const [users, roles] = await Promise.all([getUsers(), getRoles()]);

  return { users, roles };
}

export { addUser, getUsers, getRoles, deleteUser, initApp };
