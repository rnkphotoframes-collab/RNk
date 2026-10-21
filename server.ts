import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';
import { db } from './src/server/db.js';
import { authenticateAdmin, requireAdminAuth, revokeSessionToken, verifySessionToken } from './src/server/auth.js';
import { getSupabaseStatus } from './src/server/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure upload directory exists safely
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION);
const UPLOAD_DIR = isServerless
  ? path.resolve('/tmp', 'rnk_uploads')
  : path.resolve(process.cwd(), 'public', 'uploads');

try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem fallback
}

// Multer storage for persistent image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^\w-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    cb(null, `${cleanName}_${uniqueSuffix}${ext || '.jpg'}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext || mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed'));
    }
  },
});

// Serve uploaded media
app.use('/uploads', express.static(UPLOAD_DIR));

// -------------------------------------------------------------
// PUBLIC API ROUTES
// -------------------------------------------------------------

// Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  try {
    const categories = db.getCategories().filter(c => c.is_active);
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch categories' });
  }
});

// Products
app.get('/api/products', (req: Request, res: Response) => {
  try {
    const { category, search, featured } = req.query;
    const products = db.getProducts({
      activeOnly: true,
      categorySlug: typeof category === 'string' ? category : undefined,
      search: typeof search === 'string' ? search : undefined,
      featuredOnly: featured === 'true',
    });
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch products' });
  }
});

app.get('/api/products/:slugOrId', (req: Request, res: Response) => {
  try {
    const product = db.getProductBySlugOrId(req.params.slugOrId);
    if (!product || !product.is_active) {
      res.status(404).json({ error: 'Product not found or currently unavailable' });
      return;
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch product' });
  }
});

// Combos
app.get('/api/combos', (req: Request, res: Response) => {
  try {
    const { featured } = req.query;
    const combos = db.getCombos({
      activeOnly: true,
      featuredOnly: featured === 'true',
    });
    res.json(combos);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch combos' });
  }
});

app.get('/api/combos/:slugOrId', (req: Request, res: Response) => {
  try {
    const combo = db.getComboBySlugOrId(req.params.slugOrId);
    if (!combo || !combo.is_available) {
      res.status(404).json({ error: 'Combo not found or currently unavailable' });
      return;
    }
    res.json(combo);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch combo' });
  }
});

// Banners
app.get('/api/banners', (_req: Request, res: Response) => {
  try {
    const banners = db.getBanners({ activeOnly: true });
    res.json(banners);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch banners' });
  }
});

// Business Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch settings' });
  }
});

// Customer Enquiry Submission
app.post('/api/enquiries', (req: Request, res: Response) => {
  try {
    const { customer_name, phone_number, product_id, combo_id, selected_size, enquiry_type, message } = req.body;
    if (!customer_name || customer_name.trim().length < 2) {
      res.status(400).json({ error: 'Please enter a valid customer name' });
      return;
    }
    if (!phone_number || phone_number.trim().length < 8) {
      res.status(400).json({ error: 'Please enter a valid phone or WhatsApp number' });
      return;
    }

    const enquiry = db.createEnquiry({
      customer_name,
      phone_number,
      product_id,
      combo_id,
      selected_size,
      enquiry_type,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry received successfully! Our team will contact you shortly.',
      enquiry,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to submit enquiry' });
  }
});

// -------------------------------------------------------------
// ADMIN AUTHENTICATION ROUTES
// -------------------------------------------------------------

app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = authenticateAdmin(email, password);
  if (!result.success) {
    res.status(401).json({ error: result.error || 'Invalid admin credentials' });
    return;
  }
  res.json({ success: true, token: result.token, email });
});

app.get('/api/admin/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  if (!verifySessionToken(token)) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res.json({ authenticated: true });
});

app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  revokeSessionToken(token);
  res.json({ success: true });
});

// -------------------------------------------------------------
// PROTECTED ADMIN ROUTES
// -------------------------------------------------------------

// Dashboard Stats
app.get('/api/admin/stats', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const stats = db.getDashboardStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Products (all including inactive)
app.get('/api/admin/products', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const products = db.getProducts({ activeOnly: false });
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const product = db.createProduct(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const product = db.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Combos
app.get('/api/admin/combos', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const combos = db.getCombos({ activeOnly: false });
    res.json(combos);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/combos', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const combo = db.createCombo(req.body);
    res.status(201).json(combo);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/combos/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const combo = db.updateCombo(req.params.id, req.body);
    res.json(combo);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/combos/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const success = db.deleteCombo(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Combo not found' });
      return;
    }
    res.json({ success: true, message: 'Combo deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Banners
app.get('/api/admin/banners', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const banners = db.getBanners({ activeOnly: false });
    res.json(banners);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/banners', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const banner = db.createBanner(req.body);
    res.status(201).json(banner);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/banners/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const banner = db.updateBanner(req.params.id, req.body);
    res.json(banner);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/banners/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const success = db.deleteBanner(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Banner not found' });
      return;
    }
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Enquiries
app.get('/api/admin/enquiries', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const enquiries = db.getEnquiries({
      status: typeof status === 'string' ? (status as any) : undefined,
      search: typeof search === 'string' ? search : undefined,
    });
    res.json(enquiries);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/enquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { status, admin_notes } = req.body;
    const enquiry = db.updateEnquiryStatus(req.params.id, status, admin_notes);
    res.json(enquiry);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/enquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const success = db.deleteEnquiry(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Settings
app.put('/api/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Image Upload
app.post('/api/upload', requireAdminAuth, upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded' });
      return;
    }
    const publicUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Image upload failed' });
  }
});

// Admin Supabase Status & Full Export
app.get('/api/admin/supabase-status', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(getSupabaseStatus());
});

app.get('/api/admin/export', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const dump = db.exportFullBackup();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=rnk_database_export.json');
    res.json(dump);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// VITE DEV SERVER / STATIC ASSETS
// -------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`> RNK Photo Frames Server running on port ${PORT}`);
  });
}

const isDirectExecution = Boolean(
  process.argv[1] && (process.argv[1].endsWith('server.ts') || process.argv[1].endsWith('server.js'))
);

if (!isServerless && isDirectExecution && process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
