from models.all_models import Type

def get_types():
    return [
        Type(id=1, type_group=1, type_code="SPRING", type_name="イエベ春"),
        Type(id=2, type_group=1, type_code="SUMMER", type_name="ブルベ夏"),
        Type(id=3, type_group=1, type_code="AUTUMN", type_name="イエベ秋"),
        Type(id=4, type_group=1, type_code="WINTER", type_name="ブルベ冬"),
        Type(id=5, type_group=2, type_code="DRY", type_name="乾燥"),
        Type(id=6, type_group=2, type_code="SENSITIVE", type_name="敏感肌"),
        Type(id=7, type_group=2, type_code="OILY", type_name="テカリ"),
        Type(id=8, type_group=3, type_code="CUTE", type_name="キュート"),
        Type(id=9, type_group=3, type_code="FRESH", type_name="フレッシュ"),
        Type(id=10, type_group=3, type_code="FEMININE", type_name="フェミニン"),
        Type(id=11, type_group=3, type_code="COOL", type_name="クール"),
        Type(id=12, type_group=3, type_code="NATURAL", type_name="ナチュラル"),
        Type(id=13, type_group=3, type_code="ELEGANT", type_name="エレガント"),
        Type(id=14, type_group=3, type_code="SOFT_ELEGANT", type_name="ソフトエレガント"),
        Type(id=15, type_group=3, type_code="ACTIVE_CUTE", type_name="アクティブキュート"),
        Type(id=16, type_group=3, type_code="COOL_CASUAL", type_name="クールカジュアル"),
        Type(id=17, type_group=4, type_code="BASE", type_name="下地"),
        Type(id=18, type_group=4, type_code="SHADOW", type_name="アイシャドウ"),
        Type(id=19, type_group=4, type_code="LIP", type_name="リップ"),
        Type(id=20, type_group=5, type_code="MELTY_MOOD", type_name="Melty mood"),
        Type(id=21, type_group=5, type_code="UNVEIL", type_name="unveil"),
        Type(id=22, type_group=5, type_code="RAW_EDGE", type_name="Raw edge"),
        Type(id=23, type_group=5, type_code="SOLUM", type_name="SOLUM"),
        Type(id=24, type_group=5, type_code="CARE_NOTE", type_name="carenote"),
    ]