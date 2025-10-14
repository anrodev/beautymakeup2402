import { UpdateBillingSchemaType } from "@/app/updateBilling";
import {
  API_URL,
  ADMIN_AUTH,
  getJwtAuthHeader,
  getWooAuthHeader,
} from "../config";
import { ApiErrorType, AuthUserType, UserSessionType } from "@/types";

const fetchAuthUser = async (credentials: {
  username: string;
  password: string;
}): Promise<AuthUserType> => {
  try {
    const res = await fetch(`${API_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: {
        Authorization: getJwtAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const error: ApiErrorType = await res.json();
      throw new Error(error.message || "Unknown error");
    }

    return await res.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const fetchAuthenticateUser = async (
  email: string,
  pass: string
): Promise<UserSessionType> => {
  try {
    const auth = await fetchAuthUser({ username: email, password: pass });

    const wpUserRes = await fetch(`${API_URL}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    const wpUser: { id: number } = await wpUserRes.json();

    return { ...auth, id: wpUser.id };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const fetchCheckTokenUser = async (token: string) => {
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

export const fetchCreateUser = async (
  email: string,
  username: string,
  name: string,
  password: string
): Promise<{ email: string }> => {
  try {
    const auth = await fetchAuthUser(ADMIN_AUTH);

    const body: any = {
      email,
      username,
      password,
      roles: ["customer"],
    };

    if (name) {
      body.name = name;
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
      throw new Error(error.message || "Unknown error");
    }

    return await res.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const fetchUser = async (
  userId: number
): Promise<{ billing: UpdateBillingSchemaType }> => {
  try {
    const res = await fetch(`${API_URL}/wp-json/wc/v3/customers/${userId}`, {
      headers: {
        Authorization: getWooAuthHeader(),
      },
    });

    if (!res.ok) {
      const error: ApiErrorType = await res.json();
      throw new Error(error.message || "Unknown error");
    }

    return await res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchUpdateUserBilling = async (
  userId: number,
  billing: UpdateBillingSchemaType
) => {
  try {
    const res = await fetch(`${API_URL}/wp-json/wc/v3/customers/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: getWooAuthHeader(),
      },
      body: JSON.stringify({
        billing,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Unknown error");
    }

    return res.ok;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchResetUserPassword = async (email: string): Promise<{message:string}> => {
  try {
    const res = await fetch(`${API_URL}/wp-json/bdpwr/v1/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Unknown error");
    }

    return await res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchValidateUserCode = async (
  email: string,
  code: string
): Promise<{message:string}> => {
  try {
    const res = await fetch(`${API_URL}/wp-json/bdpwr/v1/validate-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Unknown error");
    }

    return await res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchSetUserPassword = async (
  email: string,
  code: string,
  password: string
): Promise<{message:string}> => {
  try {
    const res = await fetch(`${API_URL}/wp-json/bdpwr/v1/set-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
        password,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Unknown error");
    }

    return await res.json();
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
