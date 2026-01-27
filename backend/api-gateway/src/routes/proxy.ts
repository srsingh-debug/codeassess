import { Router, Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { IncomingMessage, ClientRequest } from 'http';
import { SERVICES } from '../config/services';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

const SERVICE_MAP = {
  auth: SERVICES.AUTH,
  job: SERVICES.JOB,
  candidate: SERVICES.CANDIDATE,
  application: SERVICES.APPLICATION,
  assessment: SERVICES.ASSESSMENT,
}

router.use(
  '/:service',
  (req: Request, res: Response, next: NextFunction) => {
    const service = (req.params.service || '').toLowerCase();
    
    // Check if service exists
    if (!SERVICE_MAP[service]) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Service '${service}' not found`,
          code: 'SERVICE_NOT_FOUND',
        },
      });
    }
    
    // Apply auth rate limiter only for auth service
    // if (service === 'auth') {
    //   return authLimiter(req, res, next);
    // }
    
    next();
  },
  createProxyMiddleware({
    router: (req: IncomingMessage & Request) => {
      const service = (req.params?.service || '').toLowerCase();
      return SERVICE_MAP[service];
    },
    changeOrigin: true,
    timeout: 10000,
    secure: false,
    // Forward endpoint directly to service without /api/{service}/ prefix
    // /api-gateway/{service}/{endpoint} -> {SERVICES[service]}/{endpoint}
    pathRewrite: (path: string, req: IncomingMessage & Request) => {
      const service = (req.params?.service || '').toLowerCase();
      // Remove /{service} prefix and forward the rest
      return path.replace(`/api-gateway/${service}`, '');
    },
    onProxyReq: (proxyReq: ClientRequest, req: IncomingMessage & Request) => {
      // Forward body for POST, PUT, PATCH requests
      if (['POST', 'PUT', 'PATCH', 'DELETE', 'GET'].includes(req.method || '')) {
        console.log('Forwarding body for request:', req.method);
        console.log('URL:', req.url);
        // Always forward body, even if empty (for validation purposes)
        const bodyData = req.body ? JSON.stringify(req.body) : '{}';
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onError: (err: Error, req: IncomingMessage & Request, res: Response) => {
      if (!res.headersSent) {
        const service = (req.params?.service || '').toLowerCase();
        res.status(503).json({
          success: false,
          error: {
            
            message: `${service} service unavailable`,
            code: 'SERVICE_UNAVAILABLE',
          },
        });
      }
    },
  })
);


export default router;

