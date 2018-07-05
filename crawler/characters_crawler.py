import json
from urllib.parse import urlencode
from urllib.request import urlopen
import mwparserfromhell
API_URL = "https://ja.wikipedia.org/w/api.php"

def parse(title):
    data = {"action": "query", "prop": "revisions", "rvlimit": 1,
            "rvprop": "content", "format": "json", "titles": title}
    raw = urlopen(API_URL, urlencode(data).encode()).read()
    res = json.loads(raw)
    text = list( res["query"]["pages"].values() )[0]["revisions"][0]["*"]
    return mwparserfromhell.parse(text)

if __name__ == '__main__':
    data = parse('プリパラ_(アニメ)')
    print(data.get_sections(matches='登場人物')[0].get_sections(matches="主要人物")[0])

# ここまで書いてやる気がなくなりました...