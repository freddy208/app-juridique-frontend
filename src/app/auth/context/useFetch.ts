import { useAuth } from "./AuthProvider";

type FetchOptions = RequestInit & {
  headers?: Record<string, string>;
};

export function useFetch() {
  const { accessToken, refreshAccessToken, logout } = useAuth();

  return async (url: string, options: FetchOptions = {}) => {
    // On crée un nouvel objet headers en s'assurant que TS comprend le type
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const opts: RequestInit = {
      ...options,
      headers,
      credentials: "include",
    };

    let res = await fetch(url, opts);

    if (res.status === 401) {
      await refreshAccessToken();
      // on recrée les headers après refresh
      opts.headers = {
        ...(opts.headers as Record<string, string>),
        Authorization: `Bearer ${accessToken}`,
      };
      res = await fetch(url, opts);
      if (res.status === 401) {
        logout();
      }
    }

    return res;
  };
}
