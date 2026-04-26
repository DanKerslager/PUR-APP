// netlify/functions/auth0-proxy.js

const AUTH0_DOMAIN = 'dev-cz1xfrqlz4gbz633.us.auth0.com';
const CLIENT_ID = 'HJJSClNdpO05vRw0oYXbSi9eCvkKMUFd';
const CLIENT_SECRET = 'Ro_meg_dZnC2No76c61tHeGA46CdSaThHNZ-5AiHdw22GPbTpLFe_kAsaFmC1ohQ';

async function getManagementToken() {
    const res = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            audience: `https://${AUTH0_DOMAIN}/api/v2/`,
            grant_type: 'client_credentials',
        }),
    });
    const data = await res.json();
    return data.access_token;
}

exports.handler = async (event) => {
    try {
        const { userId, action, data } = JSON.parse(event.body);
        const token = await getManagementToken();
        const url = `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`;

        if (action === 'get') {
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { statusCode: res.status, body: await res.text() };
        }

        if (action === 'patch') {
            const res = await fetch(url, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return { statusCode: res.status, body: await res.text() };
        }

        return { statusCode: 400, body: JSON.stringify({ message: 'Invalid action' }) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
    }
};
