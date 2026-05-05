const fs = require('fs');
const path = require('path');

const files = [
  'AdminLoaiVe.tsx',
  'AdminNhaCungCap.tsx',
  'AdminTicketPage.tsx',
  'AdminTour.tsx',
  'AdminDanhGia.tsx',
];

const basePath = path.join(__dirname, 'Frontend', 'my-react', 'src', 'pages');

files.forEach(file => {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace import axios from "axios"; with import api from "../services/api";
  content = content.replace(/import axios from "axios";/, 'import api from "../services/api";\nimport axios from "axios";'); // Keep axios for axios.isAxiosError

  // Remove apiClient creation
  content = content.replace(/const apiClient = axios\.create\(\{[\s\S]*?\}\);/, '');
  content = content.replace(/const dichVuApiClient = axios\.create\(\{[\s\S]*?\}\);/, '');
  content = content.replace(/const userApiClient = axios\.create\(\{[\s\S]*?\}\);/, '');

  // Replace API_BASE_URL = ... 8080 with 5000
  content = content.replace(/http:\/\/localhost:8080/g, 'http://localhost:5000');

  // Replace endpoints
  content = content.replace(/\/api\/loai-ve/g, '/api/admin/loai-ve');
  content = content.replace(/\/api\/nhacungcap/g, '/api/admin/nha-cung-cap');
  content = content.replace(/\/api\/ve/g, '/api/admin/ve');
  content = content.replace(/\/api\/tour/g, '/api/admin/tour');
  content = content.replace(/\/api\/danh-gia/g, '/api/admin/danh-gia');
  content = content.replace(/\/api\/dich-vu/g, '/api/admin/dich-vu');

  // Replace apiClient with api
  content = content.replace(/apiClient\./g, 'api.');
  content = content.replace(/dichVuApiClient\./g, 'api.');
  content = content.replace(/userApiClient\./g, 'api.');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
