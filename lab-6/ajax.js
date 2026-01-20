class Ajax {
    constructor(config) {
        this.baseURL = config.baseURL || '';
        this.headers = config.headers || { 'Content-Type': 'application/json' };
        this.timeout = config.timeout || 5000;
    }

    async get(url) {
        return await this.request(url, 'GET');
    }

    async post(url, data) {
        return await this.request(url, 'POST', data);
    }

    async put(url, data) {
        return await this.request(url, 'PUT', data);
    }

    async delete(url) {
        return await this.request(url, 'DELETE');
    }

    async request(url, method, data) {
        let fullUrl = url;
        if (this.baseURL && !url.includes('http')) {
            fullUrl = this.baseURL + url;
        }

        let body = null;
        if (data) {
            body = JSON.stringify(data);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const options = {
            method: method,
            headers: this.headers,
            signal: controller.signal,
        };

        if (body) {
            options.body = body;
        }

        try {
            const response = await fetch(fullUrl, options);
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error('Status: ' + response.status);
            }
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
}
