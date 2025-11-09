import { AuthStore } from "./storage.js";

const BASE_URL = "http://localhost:8000/api-solectric/v1";
const AUTH_URL = `${BASE_URL}/auth`;

function buildUrl(base, path) {
    if (/^https?:\/\//i.test(path)) return path;
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseOrText(res) {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return await res.json();
    return await res.text();
}

async function throwIfNotOk(res) {
    if (res.ok) return;
    const data = await parseOrText(res);
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
}

export class ApiClient {
    constructor(baseUrl = BASE_URL) { this.baseUrl = baseUrl; }

    async request(path, {
        method = "GET",
        headers = {},
        body,
        auth = true,
        signal,
    } = {}) {
        const url = buildUrl(this.baseUrl, path);
        const finalHeaders = { ...headers };

        const isFormData = (typeof FormData !== "undefined") && (body instanceof FormData);
        if (body && !isFormData && !finalHeaders["Content-Type"]) {
            finalHeaders["Content-Type"] = "application/json";
        }

        if (auth) {
            const token = AuthStore.token();
            if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(url, {
            method,
            headers: finalHeaders,
            body: body
                ? (isFormData ? body : JSON.stringify(body))
                : undefined,
            signal,
        });

        await throwIfNotOk(res);
        return await parseOrText(res);
    }

    get(path, opts)    { return this.request(path, { ...opts, method: "GET" }); }
    post(path, body, opts) { return this.request(path, { ...opts, method: "POST", body }); }
    put(path, body, opts)  { return this.request(path, { ...opts, method: "PUT",  body }); }
    del(path, opts)    { return this.request(path, { ...opts, method: "DELETE" }); }


    async login(credentials, { ttl } = {}) {
        const res = await fetch(AUTH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        await throwIfNotOk(res);
        const data = await res.json();
        AuthStore.save(data, { ttl });
        return data;
    }

    logout() { AuthStore.clear(); }
}

// Singleton listo para usar
export const api = new ApiClient();
