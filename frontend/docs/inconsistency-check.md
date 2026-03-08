# フロント不整合チェック（DBなし・静的確認）

DB なしでコード上確認した不整合・注意点です。

---

## ✅ 修正済み

### History の staff_comment
- **内容**: `getRecommendations` の戻り値に `staff_comment` は含まれないが、型と表示で参照していた。
- **対応**: 型と表示ブロックから `staff_comment` を削除した。

---

## ⚠️ 要確認・要対応

### 1. Register と Edit の「肌悩み」の値が違う

| 画面 | SKIN_CONCERNS の value |
|------|------------------------|
| Register | `"DRY"`, `"SENSITIVE"`, `"OILY"`（ラベルは 乾燥肌・敏感肌・脂性肌） |
| Edit | `"乾燥肌"`, `"敏感肌"`, `"テカり"` |

- **影響**: Register で「乾燥肌」を選ぶと API には `skin_concern: "DRY"` が送られる。Edit で API から `"DRY"` が返っても、Edit の選択肢は「乾燥肌」「敏感肌」「テカり」なので、**「乾燥肌」が選ばれた状態にならない**（value が一致しない）。
- **対応案**: どちらかに揃える。  
  - バックエンドが `"DRY"` 等のコードを期待するなら、Edit の options も `value: "DRY"` にし、label だけ「乾燥肌」にする。  
  - バックエンドが日本語可なら、Register の value を「乾燥肌」等に揃える。

---

### 2. Edit の email / phone_number が API にない

- **内容**: バックエンドの `UserGetResponse` / `UserPostRequest` に `email`, `phone_number` はない。`getUser` の戻り値にも含めていない。
- **影響**:
  - 編集画面の読み込み後、メール・電話は常に空。
  - 更新時に `updateUser` で送っているが、バックエンドが無視するか 400 になる可能性あり。
- **対応案**:
  - バックエンドに項目を追加するか、
  - フロントで Edit のメール・電話の入力・送信をやめるか、
  - 送っても「無視される」前提で残すか、のいずれかで方針を決める。

---

### 3. Edit の「肌悩み」が複数選択

- **内容**: Edit は `skin_concern` を配列で持ち、`join(",")` で API に送っている。バックエンドが `skin_concern` を 1 文字列として受け取る想定なら、`"乾燥肌,テカり"` のような形式になる。
- **影響**: バックエンドの型・保存形式次第（複数値対応か、単一文字列か）で挙動が変わる。
- **対応**: バックエンドの仕様に合わせて、単一 or 複数・区切り文字を揃える。

---

### 4. バックエンド未実装エンドポイント

以下は develop 時点で未実装 or コメントアウトのため、呼ぶと 404 などになります。

| エンドポイント | 使う画面 | 現状 |
|----------------|----------|------|
| GET /user_info/user_info/get/{token} | StaffView | 404 → エラー時は「読み込み中」のまま |
| POST /recommendation/recommendation/get | Reactions, History | 404 → 一覧が空 |
| POST /recommendation/recommendation/post | StaffView「提案する」 | 404 → 送信失敗 |
| POST /reaction/reaction/post | Reactions のリアクションボタン | 404 → 送信失敗 |

DB やバックエンド実装後、これらのルートを有効化すればフロントはそのまま利用可能。

---

### 5. VITE_API_BASE_URL が未設定のとき

- **内容**: `client.ts` は未設定だと `getBaseUrl()` が `""` を返し、相対パスで fetch する（同じオリジンのみ）。
- **影響**: バックエンドが別オリジンのときは API が動かない。`.env` で `VITE_API_BASE_URL` を設定する必要あり。

---

## ✅ 問題なさそうなところ

- **ルート**: `/`, `/register`, `/edit`, `/qr`, `/reactions`, `/users/:token`, `/history` と App.tsx の定義は一致。
- **QR の URL**: QRDisplay の `qrUrl` は `${baseUrl}/users/${token}`。スタッフ画面は `/users/:token` で一致。
- **localStorage**: `user_token`, `user_id` を useLocalUser で一貫して使用。
- **Register → setStoredUser(res.token, res.id)**: client の `registerUser` が `id`, `token` を返すので整合。
- **Reactions**: `postReaction({ user_id, product_id, reaction })`。reaction は `"like"` | `"want"` | `"dislike"`。バックエンドが同じ文字列を期待するかだけ要確認。
- **StaffView**: `postRecommendation({ user_id, product_id })` のみ送信。client と一致。

---

## まとめ

- **コード上で直したもの**: History の `staff_comment` のみ。
- **DB/バックエンドがないと確認できないもの**: 上記「要確認・要対応」の 1〜3 と、未実装 API の実際のレスポンス形式。
- **次のステップ**: 肌悩みの値・email/phone の有無をバックエンド仕様と合わせて決め、必要なら Register/Edit を修正する。
