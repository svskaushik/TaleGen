import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const target = process.env.LANGFLOW_URL || 'http://68.150.201.0:7860';
  
  return httpProxyMiddleware(req, res, {
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/api/langflow-proxy': '',
    },
  });
}
