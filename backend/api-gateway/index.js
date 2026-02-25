import express from "express";
import cors from "cors";
import http from "http";

const app = express();

// Configure CORS to allow Authorization header
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Body parsing middleware MUST come BEFORE proxy routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  next();
});

// Generic proxy function with proper header forwarding
const createProxy = (targetPort, targetPath) => {
  return async (req, res) => {
    const targetUrl = `http://localhost:${targetPort}${targetPath}${req.url}`;
    
    
    // Build headers - only include headers that have values
    const headers = {};
    
    // Only add Authorization if it exists and is not undefined
    if (req.headers.authorization && req.headers.authorization !== 'undefined') {
      headers['Authorization'] = req.headers.authorization;
    }
    
    // Only add Content-Type if it exists
    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'];
    }
    
    headers['Accept'] = 'application/json';
    
    const options = {
      method: req.method,
      headers: headers
    };

    console.log(`[Gateway] Proxy Options Headers:`, JSON.stringify(options.headers));

    const proxyReq = http.request(targetUrl, options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', (chunk) => { data += chunk; });
      proxyRes.on('end', () => {
        // console.log(`[Gateway] Response Status:`, proxyRes.statusCode);
        res.status(proxyRes.statusCode);
        Object.keys(proxyRes.headers).forEach((key) => {
          if (key !== 'transfer-encoding' && key !== 'content-encoding') {
            res.setHeader(key, proxyRes.headers[key]);
          }
        });
        try {
          const jsonData = JSON.parse(data);
          res.json(jsonData);
        } catch {
          res.send(data);
        }
      });
    });

    proxyReq.on('error', (err) => {
  
      res.status(502).json({ message: 'Bad gateway', error: err.message });
    });

    // Send body if present
    if (req.body && Object.keys(req.body).length > 0) {
      proxyReq.write(JSON.stringify(req.body));
    }
    
    proxyReq.end();
  };
};

// Routes
app.use('/api/auth', createProxy(5001, '/auth'));
app.use('/api/student', createProxy(5002, '/student'));
app.use('/api/company', createProxy(5003, '/company'));
app.use('/api/application', createProxy(5004, '/application'));

app.listen(5000, () => console.log("Gateway running on port 5000"));
