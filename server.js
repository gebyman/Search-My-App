import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = 3000;






// Middlewares
app.use(cors());
app.use(bodyParser.json());

// 使用 SQLite 資料庫
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// 初始化資料表
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `);
});

// 註冊路由
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: '所有欄位皆為必填' });
    }

    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.run(query, [username, email, password], function (err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({ message: '該電子郵件已被註冊' });
            }
            return res.status(500).json({ message: '伺服器錯誤' });
        }
        res.status(201).json({ message: '註冊成功', user: { id: this.lastID, username, email } });
    });
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
