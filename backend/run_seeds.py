# テストデータの投入
from db.session import SessionLocal
from db.seeds import get_stores, get_types

def run_all_seeds():
    db = SessionLocal()
    try:
        # 投入したいデータのリストをひとまとめにする
        all_data_sources = [
            get_stores(),
            get_types(),
        ]

        print("データ投入開始")
        for data_list in all_data_sources:
            for item in data_list:
                # 重複チェック（IDで確認）
                existing = db.query(item.__class__).filter(item.__class__.id == item.id).first()
                if not existing:
                    db.add(item)
                    print(f"✅　Added {item.__class__.__name__}: ID {item.id}")
        
        db.commit()
        print("全てのレコードを投入しました")
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_all_seeds()