# MyQR App

## 事前準備

以下がインストールされていること:
- Node.js
- npm
- Python3（Windows: python）

---

## 初回セットアップ

### 1. .envファイルを作成

プロジェクトルートに`.env`ファイルを作成し、必要な環境変数を設定してください。

### 2. バックエンドのセットアップ

bash
cd backend

#### 仮想環境の作成・起動

**Mac/Linux:**
bash
python3 -m venv venv
source venv/bin/activate

**Windows:**
bash
python -m venv venv
venv\Scripts\activate

#### ライブラリのインストール

bash
pip install -r requirements.txt

#### テーブル構築

bash
python init_db.py

#### テストデータ投入

bash
python run_seeds.py

---

## 毎回の起動手順

### フロントエンド

bash
cd frontend
npm run dev

### バックエンド

#### 1. 仮想環境の起動（未起動の場合のみ）

**Mac/Linux:**
bash
cd backend
source venv/bin/activate

**Windows:**
bash
cd backend
venv\Scripts\activate

#### 2. サーバー起動

bash
uvicorn main:app --reload

#### 3. 終了後

bash
deactivate

---

## アクセスURL
- https://sunq-frontend.onrender.com/