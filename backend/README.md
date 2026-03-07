# 🐍 バックエンド開発ガイド (FastAPI)

## 📦 前提環境

- Python 3.10 以上
- Git

---

# 🚀 リポジトリ取得

```bash
git clone https://github.com/Neo-maru/myqr-app.git
cd myqr-app/backend
```

---

# 🧪 仮想環境の作成

## Mac
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

## Windows
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

---

# 📥 ライブラリインストール
```bash
pip install -r requirements.txt
```

---

# ▶︎ サーバー起動
```bash
uvicorn main:app --reload
```
### ブラウザで http://localhost:8000/ にアクセス

### 終了後はCtrl + C

### venv切断
```bash
deactivate
```

---

# 2回目以降の起動
```bash
cd backend
source venv/bin/activate（Windowsの場合はvenv\Scripts\activate）
pip install -r requirements.txt
uvicorn main:app --reload
```

### ブラウザで http://localhost:8000/ にアクセス

### 終了後はCtrl + C

### venv切断
```bash
deactivate
```