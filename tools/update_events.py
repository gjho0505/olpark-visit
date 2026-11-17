"""올림픽공원 누리집 '일정안내'에서 오늘~3주 공연을 받아 events.js를 새로 쓴다(매일 GitHub Actions가 실행)."""
import json, re, sys, urllib.request, datetime as dt, os
sys.stdout.reconfigure(encoding="utf-8")
URL = "https://www.ksponco.or.kr/olympicpark/eventInfo/eventInfoListAjax.es"
KST = dt.timezone(dt.timedelta(hours=9))
now = dt.datetime.now(KST); today = now.date(); end = today + dt.timedelta(days=21)

def month(ym):
    req = urllib.request.Request(URL, data=json.dumps({"nowYM": ym, "plcCd": ""}).encode(),
        headers={"Content-Type": "application/json; charset=UTF-8", "User-Agent": "Mozilla/5.0", "X-Requested-With": "XMLHttpRequest"})
    d = json.loads(urllib.request.urlopen(req, timeout=60).read().decode("utf-8"))
    out = []
    def walk(x):
        if isinstance(x, dict) and "beginDt" in x: out.append(x)
        elif isinstance(x, list):
            for y in x: walk(y)
    walk(d); return out

def venue(p):
    p = re.sub(r"\s+", " ", (p or "").replace("올림픽공원", "")).strip()
    return "KSPO DOME" if "DOME" in p.upper() else p

def short(tm, n=70):
    t = re.sub(r"\s+", " ", tm or "").strip()
    return t if len(t) <= n else t[:n].rstrip(" (/,") + "…"

def days(tm):
    s = re.sub(r"\d+\s*일", "", tm or "").replace("일자", "").replace("일정", "").replace("매일", "")
    ds = sorted({"월화수목금토일".index(c) for c in s if c in "월화수목금토일"})
    return ds or None

evs, seen = [], set()
for ym in {today.strftime("%Y%m"), end.strftime("%Y%m")}:
    for e in month(ym):
        b, f = dt.date.fromisoformat(e["beginDt"]), dt.date.fromisoformat(e["endDt"])
        if f < today or b > end or e.get("delYn") == "Y" or e["evtSeq"] in seen: continue
        seen.add(e["evtSeq"])
        x = {"name": e["title"].strip(), "venue": venue(e.get("plc")), "from": e["beginDt"], "to": e["endDt"], "time": short(e.get("tm"))}
        d = days(e.get("tm"))
        if d and (f - b).days >= 7: x["days"] = d   # 긴 공연만 요일 제한
        evs.append(x)
evs.sort(key=lambda x: (x["from"], x["venue"]))
if not evs: sys.exit("no events — events.js 유지")
js = ("// 올림픽공원 공연/행사 일정(기관 누리집 '일정안내', tools/update_events.py가 매일 자동 갱신)\n"
      "window.EVENTS = " + json.dumps(evs, ensure_ascii=False, indent=1) + ";\n"
      "window.EVENTS_CHECKED = \"" + now.strftime("%Y-%m-%d %H:%M") + "\";\n")
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "events.js")
old = open(p, encoding="utf-8-sig").read()
keep = old[old.index("// 오픈API 4종"):] if "// 오픈API 4종" in old else ""
open(p, "w", encoding="utf-8").write(js + keep)
print(len(evs), "events"); [print(" ", e["from"], e["to"], e["venue"], e["name"], e.get("days")) for e in evs]
