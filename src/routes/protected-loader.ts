import { tokenStorage } from "@/shared/lib/token";
import { redirect } from "react-router";

export async function protectedLoader() {
  const token = tokenStorage.getToken();
  if (!token) {
    throw redirect("/login");
  }
  return null;
}

export async function loginLoader() {
  const token = tokenStorage.getToken();
  if (token) {
    throw redirect("/");
  }
  return null;
}
