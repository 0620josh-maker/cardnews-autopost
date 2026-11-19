#!/usr/bin/env python3
"""
인스타그램(캐러셀) + 스레드(캐러셀) 자동 게시 스크립트
- 표준 라이브러리만 사용 (pip 설치 불필요)
- 이미지는 반드시 인터넷에서 접근 가능한 공개 URL이어야 함 (Meta API가 URL을 직접 내려받음)
- 인스타그램은 JPEG만 허용 → 카드뉴스는 .jpg 파일을 사용

환경변수
  IG_ACCESS_TOKEN, IG_USER_ID           : Instagram API (Instagram 로그인 방식, graph.instagram.com)
  THREADS_ACCESS_TOKEN, THREADS_USER_ID : Threads API (graph.threads.net)

사용법
  python3 post_to_social.py --config post_config.json --dry-run    # 내용만 확인
  python3 post_to_social.py --config post_config.json              # 실제 게시 (인스타+스레드)
  python3 post_to_social.py --config post_config.json --only threads
"""
import argparse, json, os, sys, time, urllib.parse, urllib.request

IG_BASE = "https://graph.instagram.com/v21.0"
FB_BASE = "https://graph.facebook.com/v21.0"


def ig_base(token):
    """EA로 시작하는 토큰(Facebook/통합 로그인)은 graph.facebook.com, IGAA 토큰은 graph.instagram.com"""
    return FB_BASE if token and token.startswith("EA") else IG_BASE
TH_BASE = "https://graph.threads.net/v1.0"


def call(method, url, params):
    data = urllib.parse.urlencode(params).encode()
    if method == "GET":
        req = urllib.request.Request(url + "?" + data.decode())
    else:
        req = urllib.request.Request(url, data=data, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        sys.exit(f"[API 오류] {url}\n{e.read().decode()}")


def wait_ready(base, cid, token, field="status_code", tries=30):
    for _ in range(tries):
        st = call("GET", f"{base}/{cid}", {"fields": field, "access_token": token}).get(field)
        if st in ("FINISHED", "PUBLISHED"):
            return
        if st in ("ERROR", "EXPIRED"):
            sys.exit(f"[처리 실패] 컨테이너 {cid}: {st}")
        time.sleep(3)
    sys.exit(f"[시간 초과] 컨테이너 {cid}")


def post_instagram(cfg, dry):
    tok, uid = os.environ.get("IG_ACCESS_TOKEN"), os.environ.get("IG_USER_ID")
    imgs = cfg["instagram"]["images"]
    assert 2 <= len(imgs) <= 10, "인스타 캐러셀은 2~10장"
    assert all(u.lower().split("?")[0].endswith((".jpg", ".jpeg")) for u in imgs), "인스타는 JPEG만 가능"
    if dry:
        print("\n".join(imgs)); print(f"[DRY] Instagram {len(imgs)}장\n캡션({len(cfg['instagram']['caption'])}자):\n{cfg['instagram']['caption']}\n")
        return
    if not (tok and uid):
        sys.exit("IG_ACCESS_TOKEN / IG_USER_ID 환경변수가 없습니다")
    base = ig_base(tok)
    children = []
    for u in imgs:
        c = call("POST", f"{base}/{uid}/media", {"image_url": u, "is_carousel_item": "true", "access_token": tok})["id"]
        wait_ready(base, c, tok)
        children.append(c)
    parent = call("POST", f"{base}/{uid}/media", {
        "media_type": "CAROUSEL", "children": ",".join(children),
        "caption": cfg["instagram"]["caption"], "access_token": tok})["id"]
    wait_ready(base, parent, tok)
    res = call("POST", f"{base}/{uid}/media_publish", {"creation_id": parent, "access_token": tok})
    print("Instagram 게시 완료:", res)


def post_threads(cfg, dry):
    tok, uid = os.environ.get("THREADS_ACCESS_TOKEN"), os.environ.get("THREADS_USER_ID")
    imgs, text = cfg["threads"]["images"], cfg["threads"]["text"]
    assert len(text) <= 500, f"스레드 본문 500자 초과({len(text)}자)"
    assert 2 <= len(imgs) <= 20, "스레드 캐러셀은 2~20장"
    if dry:
        print(f"[DRY] Threads {len(imgs)}장\n본문({len(text)}자):\n{text}\n")
        return
    if not (tok and uid):
        sys.exit("THREADS_ACCESS_TOKEN / THREADS_USER_ID 환경변수가 없습니다")
    children = []
    for u in imgs:
        c = call("POST", f"{TH_BASE}/{uid}/threads", {"media_type": "IMAGE", "image_url": u, "is_carousel_item": "true", "access_token": tok})["id"]
        children.append(c)
    time.sleep(10)
    parent = call("POST", f"{TH_BASE}/{uid}/threads", {
        "media_type": "CAROUSEL", "children": ",".join(children), "text": text, "access_token": tok})["id"]
    time.sleep(30)  # Meta 권장: 게시 전 약 30초 대기
    res = call("POST", f"{TH_BASE}/{uid}/threads_publish", {"creation_id": parent, "access_token": tok})
    print("Threads 게시 완료:", res)


def resolve_urls(cfg, config_path):
    """이미지 값이 http로 시작하지 않으면(파일 이름만 적었으면) GitHub 공개 주소로 자동 변환"""
    repo = os.environ.get("GITHUB_REPOSITORY")
    branch = os.environ.get("GITHUB_REF_NAME", "main")
    folder = os.path.dirname(os.path.relpath(config_path)).replace(os.sep, "/")
    for ch in ("instagram", "threads"):
        out = []
        for u in cfg[ch]["images"]:
            if u.startswith("http"):
                out.append(u)
            elif repo:
                out.append(f"https://raw.githubusercontent.com/{repo}/{branch}/{folder}/{u}")
            else:
                out.append(f"(GitHub에서 실행 시 자동 주소) {folder}/{u}")
        cfg[ch]["images"] = out
    return cfg


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only", choices=["instagram", "threads"])
    a = ap.parse_args()
    cfg = resolve_urls(json.load(open(a.config, encoding="utf-8")), a.config)
    if a.only in (None, "instagram"):
        post_instagram(cfg, a.dry_run)
    if a.only in (None, "threads"):
        post_threads(cfg, a.dry_run)
