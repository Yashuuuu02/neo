
import https from 'https';
import dns from 'dns';
import { IncomingMessage } from 'http';
const { Headers, Request, Response } = require('node-fetch');

// Export functionality for Polyfill
export { Headers, Request, Response };

// Force Google DNS to bypass local resolver issues
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.warn('[SimpleFetch] Failed to set DNS servers:', e);
}

// Manual DNS resolve function
async function resolveHostname(hostname: string): Promise<string> {
    // If it's already an IP, return it
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return hostname;

    // console.log(`[SimpleFetch] Resolving ${hostname} (manual c-ares, 8.8.8.8)...`);
    try {
        const addresses = await dns.promises.resolve4(hostname);
        if (!addresses || addresses.length === 0) {
            throw new Error('No addresses found');
        }
        const addr = addresses[0];
        console.log(`[SimpleFetch] Resolved ${hostname} -> ${addr}`);
        return addr;
    } catch (e: any) {
        console.warn(`[SimpleFetch] resolve4 failed for ${hostname}: ${e.message}`);
        throw e;
    }
}

export async function simpleFetch(input: string | any, init: any = {}): Promise<any> {
    let urlStr: string;
    let options = init || {};

    // Handle Request object as first argument
    if (typeof input === 'object' && input !== null && input.url) {
        urlStr = input.url;
        // Merge options from Request object if needed (e.g. method, headers)
        // For simplicity, we assume init overrides or complements Request
        options = {
            method: input.method,
            headers: input.headers,
            body: input.body,
            ...init
        };
    } else {
        urlStr = String(input);
    }

    const urlObj = new URL(urlStr);
    const method = options.method || 'GET';
    const body = options.body;
    // Normalize headers
    const headers = options.headers || {};

    // Resolve IP manually
    let ip;
    try {
        ip = await resolveHostname(urlObj.hostname);
    } catch (e) {
        // Fallback to hostname if resolution fails (let https try)
        console.error(`[SimpleFetch] DNS error, falling back to hostname: ${e}`);
        ip = urlObj.hostname;
    }

    return new Promise((resolve, reject) => {
        const reqOptions = {
            hostname: ip,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                ...headers,
                // Ensure Host header matches original hostname (crucial for some servers)
                Host: urlObj.hostname
            },
            servername: urlObj.hostname, // Crucial for SNI (TLS)
            agent: false // Disable agent pooling for simplicity or use keepAlive agent without lookup
        };

        const req = https.request(reqOptions, (res: IncomingMessage) => {
            const chunks: any[] = [];
            res.on('data', (d) => chunks.push(d));
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const text = buffer.toString();

                // const { Headers, Response } = require('node-fetch'); // Moved to top level

                // ...
                const responseHeaders = new Headers(res.headers);

                // Use node-fetch Response for full compatibility (clone, etc.)
                const fetchResponse = new Response(text, {
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    headers: responseHeaders
                });

                resolve(fetchResponse);
            });
        });

        req.on('error', (e) => {
            console.error(`[SimpleFetch] Network Error: ${e.message}`);
            reject(e);
        });

        if (body) {
            req.write(body);
        }
        req.end();
    });
}
