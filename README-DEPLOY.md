# Backend Deployment Guide

## Environment Variables

Tạo file `.env` trong thư mục gốc của backend:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=your_mongodb_connection_string

# Zalo Checkout SDK
CHECKOUT_SDK_PRIVATE_KEY=your_private_key

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

## CORS Configuration

Backend đã được cấu hình CORS cho:

- `https://h5.zdn.vn` - Zalo Mini Program
- `http://localhost:3000` - Development
- `http://localhost:5173` - Vite dev server
- `http://localhost:2999` - Frontend dev server
- `FRONTEND_URL` - Frontend domain từ environment variable

**Lưu ý:** CORS đã được cấu hình để hỗ trợ development và production environments.

## Deploy Platforms

### Render (Recommended)

1. Connect GitHub repository
2. Set environment variables trong Render dashboard
3. Build command: `npm install && npm start`
4. Deploy automatically

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set environment variables trong Vercel dashboard

### Heroku

1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Set environment variables: `heroku config:set FRONTEND_URL=https://your-domain.com`

### Railway

1. Connect GitHub repository
2. Set environment variables trong Railway dashboard
3. Deploy automatically

## Database Setup

### MongoDB Atlas

1. Tạo cluster mới
2. Set network access (0.0.0.0/0 for all IPs)
3. Tạo database user
4. Copy connection string

### Local MongoDB

```bash
# Install MongoDB
brew install mongodb-community # macOS
sudo apt-get install mongodb # Ubuntu

# Start MongoDB
mongod
```

## API Endpoints

### Products

- `GET /products` - Lấy danh sách sản phẩm
- `GET /products/:id` - Lấy chi tiết sản phẩm

### Categories

- `GET /categories` - Lấy danh sách danh mục
- `GET /categories/:id` - Lấy chi tiết danh mục

### Stations

- `GET /stations` - Lấy danh sách trạm
- `GET /stations/:id` - Lấy chi tiết trạm

### Orders

- `GET /orders` - Lấy danh sách đơn hàng
- `GET /orders/:id` - Lấy chi tiết đơn hàng
- `POST /orders` - Tạo đơn hàng mới
- `PUT /orders/:id` - Cập nhật toàn bộ đơn hàng
- `PATCH /orders/:id` - Cập nhật một phần đơn hàng
- `DELETE /orders/:id` - Xóa đơn hàng

### Zalo Checkout SDK

- `POST /mac` - Tạo MAC cho Checkout SDK
- `POST /link` - Liên kết đơn hàng với Checkout SDK
- `POST /callback` - Webhook callback từ Zalo

## Testing

### Local Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## Monitoring

- Logs: Check platform logs
- Health check: `GET /` endpoint
- Database connection: MongoDB connection status

## Security

- CORS đã được cấu hình cho development và production
- Environment variables cho sensitive data
- HTTPS enforcement (commented out, enable khi cần)
- Input validation (implement thêm nếu cần)

## Current Deployment

Backend hiện tại đã được deploy tại: `https://zaui-erf-backend.onrender.com`

CORS đã được cấu hình để hỗ trợ:

- Frontend development tại `http://localhost:2999`
- Zalo Mini Program tại `https://h5.zdn.vn`
- Các origin khác từ environment variables
