import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

const app = express();
const PORT = process.env.PORT || 3000; // 支援動態埠號

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// 使用 SQLite 資料庫
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
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
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Users table initialized successfully.');
        }
    });
});

// 根路徑測試
app.get('/', (req, res) => {
    res.send('Welcome to My App! The server is running successfully.');
});

// 註冊路由
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    console.log('Received data:', { username, email, password });

    // 驗證必填欄位
    if (!username || !email || !password) {
        console.log('Validation failed: Missing fields');
        return res.status(400).json({ message: '所有欄位皆為必填' });
    }

    try {
        // 使用 bcrypt 加密密碼
        const hashedPassword = await bcrypt.hash(password, 10);

        // 插入資料到資料庫
        const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
        db.run(query, [username, email, hashedPassword], function (err) {
            if (err) {
                console.error('Database error:', err.message);
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ message: '該電子郵件已被註冊' });
                }
                return res.status(500).json({ message: '伺服器錯誤', error: err.message });
            }

            console.log('Data inserted successfully:', { id: this.lastID, username, email });
            res.status(201).json({ message: '註冊成功', user: { id: this.lastID, username, email } });
        });
    } catch (error) {
        console.error('Unexpected server error:', error.message);
        res.status(500).json({ message: '伺服器錯誤', error: error.message });
    }
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
