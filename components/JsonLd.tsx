/**
 * JSON-LD 構造化データを <script type="application/ld+json"> として出力する。
 * static export でもそのまま HTML に焼かれる。
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // 構造化データは自前生成の固定オブジェクトなので XSS リスクは無い。
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
