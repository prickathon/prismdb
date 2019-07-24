# stat作成メモ

クエリ : 
```
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX prism: <https://prismdb.takanakahiko.me/prism-schema.ttl#>
SELECT (group_concat(concat(' ', str(?cnt), ' ', strafter(str(?o), '#'), 's'); separator=',') as ?stat) WHERE { SELECT ?o (COUNT(?s) AS ?cnt) WHERE { ?s rdf:type ?o FILTER (?o IN (prism:Character, prism:Episode, prism:Song, prism:Live, prism:Item)) } GROUP BY ?o }
```

A :  エンコード(クエリ)

B : `https://prismdb.takanakahiko.me/sparql?query=` + A + `&format=application/json`

C : エンコード(B)

画像パス : `https://img.shields.io/badge/dynamic/json.svg?label=stat&query=%24.results.bindings%5B%3A1%5D.stat.value&url=` + C + `&color=ffaad7`
