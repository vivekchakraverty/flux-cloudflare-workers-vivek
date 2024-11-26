# flux-cloudflare-workers

This is a simple application for integrating Flux-1-Schnell with Cloudflare Workers to quickly deploy an AI-powered service.

# Setup and Usage

## Prerequisites

[Cloudflare account](https://dash.cloudflare.com/)

[Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

## Setup

1. Fork this repository and clone it to your local machine. Open your project directory.

2. Set up a secret key for your project (e.g., KEYHOLDER="your-password"). This is required to access the application.

Run the following command to add the secret:

```bash
npx wrangler secret put KEYHOLDER
```

3. Deploy the project to Cloudflare Workers using Wrangler:

```bash
npx wrangler deploy
```

4.Once deployed, your application will be available at:

- Web URL: https://your-project-domain.workers.dev/?key=your-password

- API Endpoint: https://your-project-domain/api/generate?key=your-password&prompt=your-prompt&steps=8
