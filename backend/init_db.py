from db.session import engine, Base
from models.all_models import User, Product, ProductTag, Recommendation, Store, Type

def init_db():
    print("myqr.dbのテーブルを作成します")
    Base.metadata.create_all(bind=engine)
    print("全てのテーブルを作成しました")

if __name__ == "__main__":
    init_db()