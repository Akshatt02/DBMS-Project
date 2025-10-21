const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function createApi({ getToken, onUnauthorized } = {}) {
	return async function api(path, { method = 'GET', body = null, token = null } = {}) {
		const headers = { 'Content-Type': 'application/json' };
		const t = token || (getToken ? getToken() : null);
		if (t) headers['Authorization'] = `Bearer ${t}`;

		const res = await fetch(`${API}/api${path}`, {
			method,
			headers,
			body: body ? JSON.stringify(body) : null,
		});

		if (res.status === 401 && onUnauthorized) {
			onUnauthorized();
			throw { status: 401, message: 'Unauthorized' };
		}

		const text = await res.text();
		try {
			const json = text ? JSON.parse(text) : null;
			if (!res.ok) throw { status: res.status, ...json };
			return json;
		} catch (err) {
			if (!res.ok) throw { status: res.status, message: text || 'Request failed' };
			return text;
		}
	};
}

export default createApi;
