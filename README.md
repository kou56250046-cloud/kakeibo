# 家計フロー・ナビ — デプロイ手順

## ファイル構成

```
kakeibo/
├── index.html            ← メインアプリ（PWA対応・認証付き）
├── manifest.webmanifest  ← PWA設定
├── service-worker.js     ← オフライン対応
├── firestore.rules       ← セキュリティルール（★要編集）
├── firebase.json         ← Firebase Hosting設定
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── README.md             ← 本ファイル
```

---

## フェーズ1 デプロイ手順

### 1. Firebase CLI インストール（初回のみ）
```bash
npm install -g firebase-tools
firebase login
```

### 2. プロジェクトの初期化（初回のみ）
```bash
cd kakeibo/
firebase use kakeibo-family-f8129
```

### 3. Firebase Authentication を有効化（Firebaseコンソール）
1. Firebaseコンソール → Authentication → Sign-in method
2. 「Google」プロバイダを「有効」にする
3. 「承認済みドメイン」に Firebase Hosting のドメインが入っていることを確認
   - `kakeibo-family-f8129.web.app`
   - `kakeibo-family-f8129.firebaseapp.com`

### 4. まず仮デプロイ（UIDs確認のため）
```bash
firebase deploy --only hosting
```

### 5. 2人のUIDを確認
1. デプロイしたURLにアクセス
2. 2人それぞれ「Googleでログイン」
3. ダッシュボード上部のバナーに表示される**UID（長い文字列）をコピー**

### 6. firestore.rules にUIDを記入
```
function isAllowed() {
  return request.auth != null
      && request.auth.uid in [
        "ここに1人目のUIDを貼り付け",  ← コピーしたUID
        "ここに2人目のUIDを貼り付け"   ← コピーしたUID
      ];
}
```

### 7. 本番デプロイ（セキュリティルール込み）
```bash
firebase deploy
```

---

## PWA インストール方法

### Android (Chrome)
- ブラウザのアドレスバー右端「インストール」ボタンをタップ
- またはメニュー → 「ホーム画面に追加」

### iPhone (Safari)
- 画面下部の共有ボタン（□↑）→「ホーム画面に追加」
- ※ Safari から行うこと（Chromeアプリからは不可）

---

## 次フェーズ（実装予定）

- **フェーズ2**: 商品マスタ＋明細付き購入記録＋「商品ごとの最安店」ビュー
- **フェーズ3**: レシート撮影 → Tesseract.js OCR → 明細自動下書き
