
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Tạo thư mục C:/data nếu chưa có
const dataDir = path.join('C:/data');
const dataFile = path.join(dataDir, 'users.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({}), 'utf8');
}

app.use(express.json());

app.post('/api/donate', (req, res) => {
  const { username, amount } = req.body;

  if (!username || isNaN(amount)) {
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
  }

  // Đọc dữ liệu hiện tại
  let users = {};
  try {
    users = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (err) {
    users = {};
  }

  // Cập nhật số dư
  if (!users[username]) {
    users[username] = 0;
  }
  users[username] += amount;

  // Ghi lại vào file
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2), 'utf8');

  res.json({ message: `Đã nạp ${amount} VND cho ${username}.` });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
