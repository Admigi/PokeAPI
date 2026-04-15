# PokeAPI

Spring Boot GraphQLとReactで構築したフルスタックのポケモン図鑑アプリです。第1世代の151匹のポケモンを検索・絞り込み・並び替えできる、クリーンでレスポンシブなUIを備えています。

🔗 **[ライブデモ](https://poke-api-admigi.up.railway.app)**

---

## 🛠️ 技術スタック

**バックエンド**
- Java 21 / Spring Boot
- Spring for GraphQL
- Maven
- JUnit（ユニットテスト）

**フロントエンド**
- React 19 / TypeScript
- TanStack Start（SSR）+ TanStack Router
- Tailwind CSS v4
- Vite
- Vitest + React Testing Library（コンポーネントテスト）

**インフラ**
- Docker / Docker Compose
- GitHub Actions（CI/CD）
- Railway（デプロイ）

---

## 🏗️ アーキテクチャ

Railway上に独立してデプロイされた2つのサービスで構成されるモノレポ構成です。

```
PokeAPI/
├── backend/       # Spring Boot GraphQL API
├── frontend/      # TanStack Start SSR app
└── docker-compose.yml
```

**バックエンド**は単一の `/graphql` エンドポイントを公開しており、ポケモン一覧の取得（絞り込み・並び替え・ページネーション対応）、IDによる個別取得、ステータスバーのスケーリング用のグローバル最大値取得が可能です。データはローカルのJSONデータセットから提供されます。

**フロントエンド**はサーバーサイドレンダリング（SSR）対応のReactアプリです。GraphQLはApolloやurqlを使わず、ネイティブの `fetch` APIで直接取得しています。検索・絞り込み・並び替え・ページ番号などのUIの状態はすべてURLに保持されるため、あらゆる画面がURLで共有・ブックマーク可能です。

---

## ✨ 機能

### グリッドページ
- レスポンシブカードグリッド — モバイルは2列、デスクトップは自動調整
- 各カードにポケモンのスプライト、ID、名前、タイプバッジを表示
- 名前またはIDで検索
- タイプで絞り込み（**OR**（いずれか）/ **AND**（すべて）モード対応）
- 基本ステータス（HP、こうげき、ぼうぎょ、とくこう、とくぼう、すばやさ）で並び替え（昇順/降順切り替え対応）
- 並び替え中は各カードにミニステータスバーを表示
- 折りたたみ可能なサイドバー — モバイルではスクロールロック付きのオーバーレイドロワー
- 初回読み込み時のスケルトンローディング
- ページネーション（1ページ35匹、ページ変更時に自動スクロール）

### 詳細ページ
- ポケモンの第一タイプに基づいた全幅カラーヒーローセクション
- 6つの基本ステータスをグローバル最大値基準のアニメーションバーで表示
- 合計ステータス値
- ブラウザ履歴を使ったPrev/Nextナビゲーション — 戻るボタンで絞り込み条件を保持したままグリッドへ戻る
- レスポンシブレイアウト — モバイルではスプライトが名前の上に表示
- 初回読み込み時のモンスターボールスピナー

---

## ⚙️ CI/CD

GitHub Actionsがプッシュのたびにバックエンドとフロントエンドのテストを並列実行します。両方のテストが通過した場合のみDockerビルドが実行されます。`master` へのマージでRailwayへ自動デプロイされます。

```
push → [バックエンドテスト] ──┐
                               ├── 両方通過 → Dockerビルド → デプロイ
       [フロントエンドテスト] ──┘
```

---

## 🚀 ローカル環境での起動

### 前提条件
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 起動方法

```bash
git clone https://github.com/Admigi/PokeAPI.git
cd PokeAPI
docker compose up --build
```

| サービス | URL |
|---------|-----|
| フロントエンド | http://localhost:3000 |
| バックエンド GraphQL | http://localhost:8080/graphql |
| GraphiQL プレイグラウンド | http://localhost:8080/graphiql |

---

## 📸 スクリーンショット

<div align="center">

**デスクトップ — 絞り込みと並び替えを適用した状態**

![デスクトップ グリッド](screenshots/desktop-grid.png)

**詳細ページ — リザードン**

![ポケモン詳細ページ](screenshots/detail-page.png)

**モバイル — サイドバーオーバーレイ**

<img src="screenshots/mobile-grid.jpg" width="300" alt="モバイル グリッド サイドバー" />

</div>

---

## 📝 ライセンス

このプロジェクトはオープンソースであり、[MITライセンス](LICENSE)のもとで公開されています。

---

## ⚠️ 免責事項

このプロジェクトは学習目的で作成した個人のポートフォリオ作品であり、商業的な意図は一切ありません。ポケモンおよび関連するすべての名称、キャラクター、データは任天堂・ゲームフリーク・株式会社ポケモンの商標です。本プロジェクトはこれらの企業とは一切関係なく、公認・推薦・提携するものでもありません。
