// src/api.js
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function api(path, { method = 'GET', body = null, token = null } = {}) {
	const headers = { 'Content-Type': 'application/json' };
	if (token) headers['Authorization'] = `Bearer ${token}`;
	const res = await fetch(`${API}/api${path}`, {
		method,
		headers,
		body: body ? JSON.stringify(body) : null,
	});
	const text = await res.text();
	try {
		const json = text ? JSON.parse(text) : null;
		if (!res.ok) throw { status: res.status, ...json };
		return json;
	} catch (err) {
		// If parsing fails, return raw text
		if (!res.ok) throw { status: res.status, message: text || 'Request failed' };
		return text;
	}
}
