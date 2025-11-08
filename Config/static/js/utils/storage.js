// Pequeño wrapper con TTL y namespacing
const PREFIX = "solectric:";
const LS = window.localStorage;

function k(key) { return `${PREFIX}${key}`; }

export const Storage = {
    set(key, value, { ttl } = {}) {
        const record = {
            v: value,
            // e = epoch ms de expiración (opcional)
            e: typeof ttl === "number" ? Date.now() + ttl : null,
        };
        LS.setItem(k(key), JSON.stringify(record));
    },

    get(key, fallback = null) {
        const raw = LS.getItem(k(key));
        if (!raw) return fallback;
        try {
            const { v, e } = JSON.parse(raw);
            if (e && Date.now() > e) {
                LS.removeItem(k(key));       // expiró: limpiar
                return fallback;
            }
            return v;
        } catch {
            // si se corrompe, limpiar
            LS.removeItem(k(key));
            return fallback;
        }
    },

    remove(key) { LS.removeItem(k(key)); },
    has(key)    { return LS.getItem(k(key)) !== null; },
    clearAll() {
        // sólo limpia llaves con nuestro prefijo
        Object.keys(LS).forEach((key) => {
            if (key.startsWith(PREFIX)) LS.removeItem(key);
        });
    },
};

// Azúcar específico para auth
const TOKEN_KEY = "auth:access_token";
const USER_KEY  = "auth:user";

export const AuthStore = {
    save({ access_token, user_data }, { ttl } = {}) {
        if (access_token) Storage.set(TOKEN_KEY, access_token, { ttl });
        if (user_data)    Storage.set(USER_KEY,  user_data);
    },
    token()   { return Storage.get(TOKEN_KEY); },
    user()    { return Storage.get(USER_KEY); },
    clear()   { Storage.remove(TOKEN_KEY); Storage.remove(USER_KEY); },
};
