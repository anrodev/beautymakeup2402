import { API_URL, ADMIN_AUTH, getJwtAuthHeader } from "../config";
import { ApiErrorType, AuthUserType } from "@/types";

export const authenticateUser = async (email: string, pass: string) => {
  const authRes = await fetch(`${API_URL}/wp-json/jwt-auth/v1/token`, {
    method: "POST",
    headers: {
      Authorization: getJwtAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: email,
      password: pass,
    }),
  });

  if (!authRes.ok) {
    const error: ApiErrorType = await authRes.json();
    throw new Error(error.message || "Unknown error");
  }

  const auth: AuthUserType = await authRes.json();

  const wpUserRes = await fetch(`${API_URL}/wp-json/wp/v2/users/me`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });

  const wpUser: { id: number } = await wpUserRes.json();

  return { ...auth, id: wpUser.id };
};

export const checkTokenUser = async (token: string) => {
  try {
    const res = await fetch(`${API_URL}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const createUser = async (
  email: string,
  username: string,
  name: string,
  password: string
) => {
  try {

    const authRes = await fetch(`${API_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: {
        Authorization: getJwtAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ADMIN_AUTH),
    });

    if (!authRes.ok) {
      const error: ApiErrorType = await authRes.json();
      throw new Error(error.message || "Unknown error");
    }

    const auth: AuthUserType = await authRes.json();

    const body:any = {
      email,
      username,
      password,
      roles: ["customer"]
    }

    if(name){

      body.name=name;
    }

    const res = await fetch(`${API_URL}/wp-json/wp/v2/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error: ApiErrorType = await res.json();
      throw new Error(error.message || "Error al crear usuario");
    }

    const user:{email:string} = await res.json();

    return user;
    
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
