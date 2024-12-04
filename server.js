import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('資料庫檔案位置:', __dirname + '/users.db');
const app = express();
const PORT = 3000;
const allowedOrigins = [
    'https://gebyman.github.io', // GitHub Pages 的前端網址
    'http://localhost:8080', // 本地測試用網址
];
// 中間件
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // 允許請求
        } else {
            callback(new Error('Not allowed by CORS')); // 拒絕請求
        }
    },
    methods: ['GET', 'POST'], // 允許的 HTTP 方法
    allowedHeaders: ['Content-Type'], // 允許的請求標頭
}));
app.use(bodyParser.json());

// 初始化 SQLite 資料庫
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('資料庫連接錯誤:', err.message);
    } else {
        console.log('已連接到 SQLite 資料庫');
        console.log('資料庫檔案位置:', __dirname + '/users.db');
    }
});

// 初始化資料表
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`);

// 註冊路由
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: '所有欄位皆為必填' });
    }

    const query = `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
    `;
    db.run(query, [username, email, password], function (err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({ message: '該電子郵件已被註冊' });
            }
            console.error('資料庫錯誤:', err.message);
            return res.status(500).json({ message: '伺服器錯誤' });
        }
        res.status(201).json({ message: '註冊成功', user: { id: this.lastID, username, email } });
    });
});

// 登入路由
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: '所有欄位皆為必填' });
    }

    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], (err, user) => {
        if (err) {
            console.error('資料庫錯誤:', err.message);
            return res.status(500).json({ message: '伺服器錯誤' });
        }

        if (!user) {
            return res.status(404).json({ message: '用戶不存在' });
        }

        // 驗證密碼（直接比對明文）
        if (user.password === password) {
            res.status(200).json({
                message: '登入成功',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            });
        } else {
            res.status(401).json({ message: '密碼錯誤' });
        }
    });
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`伺服器正在運行於 http://localhost:${PORT}`);
});
