#!/usr/bin/env bash
# smoke.sh: the launch-gate curl smoke test (2026-10-07), the final URL set.
#
#   bash .measure/audit/smoke.sh live     # against https://vexeltechsolutions.com, after upload
#   bash .measure/audit/smoke.sh local    # against .measure/serve-dist.mjs on :4190
#
# LIVE asks the real server for the real http://, www. and slash variants.
# LOCAL asks localhost and simulates the scheme and host with the headers
# serve-dist.mjs reads (X-Forwarded-Proto: http, Host: www...), because
# there is no TLS or DNS locally. Every check prints PASS or FAIL; the exit
# code is the number of failures.
#
# What it checks:
#   1. the eight pages answer 200 at their canonical URL
#   2. unknown paths answer a real 404 with the not-found page
#   3. every http / www / trailing-slash / index.html variant of every page,
#      and every old alias, is ONE 301 straight to the canonical https URL,
#      and that URL answers 200 (no chain)
#   4. the security headers on a page; HSTS on HTTPS only
#   5. caching: HTML no-cache, /assets/ immutable for a year
#   6. compression: brotli or gzip on HTML, CSS and JS; none on woff2,
#      video and images
set -u
MODE="${1:-local}"
CANON="https://vexeltechsolutions.com"
LOCAL="http://localhost:4190"
FAIL=0
pass() { printf 'PASS  %s\n' "$1"; }
fail() { printf 'FAIL  %s\n' "$1"; FAIL=$((FAIL + 1)); }

# req SCHEME HOST PATH -> sets CODE and LOC
req() {
  local scheme="$1" host="$2" path="$3" out
  if [ "$MODE" = live ]; then
    out=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$scheme://$host$path")
  else
    local h=(-H "Host: $host")
    [ "$scheme" = http ] && h+=(-H "X-Forwarded-Proto: http")
    out=$(curl -s -o /dev/null -w '%{http_code} %header{location}' "${h[@]}" "$LOCAL$path")
  fi
  CODE="${out%% *}"
  LOC="${out#* }"
}

# get the canonical URL's status, live or local
canon_status() {
  local path="${1#$CANON}"
  [ -z "$path" ] && path=/
  path="${path%%#*}"
  req https vexeltechsolutions.com "$path"
  echo "$CODE"
}

PAGES=(/ /services /pricing /about-us /contact-us /privacy-policy /terms-of-service /thanks)

echo "== 1. Pages at their canonical URL"
for p in "${PAGES[@]}"; do
  req https vexeltechsolutions.com "$p"
  [ "$CODE" = 200 ] && pass "200 $p" || fail "$CODE $p (want 200)"
done

echo "== 2. Unknown paths are a real 404"
for p in /nope /services/nope /app.html /blog-post-that-never-was.html; do
  req https vexeltechsolutions.com "$p"
  [ "$CODE" = 404 ] && pass "404 $p" || fail "$CODE $p (want 404)"
done
if [ "$MODE" = live ]; then body=$(curl -s "$CANON/nope"); else body=$(curl -s -H 'Host: vexeltechsolutions.com' "$LOCAL/nope"); fi
echo "$body" | grep -q "That page isn&#x27;t here\|That page isn't here" && echo "$body" | grep -q 'name="robots" content="noindex"' \
  && pass "404 body is the not-found page with noindex" || fail "404 body is not the not-found page with noindex"

echo "== 3. One hop to the canonical URL"
hop() { # scheme host path want
  req "$1" "$2" "$3"
  if [ "$CODE" != 301 ]; then fail "$CODE $1://$2$3 (want 301 to $4)"; return; fi
  if [ "$LOC" != "$4" ]; then fail "301 $1://$2$3 -> $LOC (want $4)"; return; fi
  local s; s=$(canon_status "$LOC")
  [ "$s" = 200 ] && pass "301 $1://$2$3 -> $LOC (200, one hop)" || fail "301 $1://$2$3 -> $LOC answers $s"
}
for p in "${PAGES[@]}"; do
  want="$CANON$p"; [ "$p" = / ] && want="$CANON/"
  if [ "$p" = / ]; then variants=("/" "/index.html"); else variants=("$p" "$p/" "$p/index.html"); fi
  for v in "${variants[@]}"; do
    for sh in "https vexeltechsolutions.com" "http vexeltechsolutions.com" "https www.vexeltechsolutions.com" "http www.vexeltechsolutions.com"; do
      set -- $sh
      [ "$1" = https ] && [ "$2" = vexeltechsolutions.com ] && [ "$v" = "$p" ] && continue
      hop "$1" "$2" "$v" "$want"
    done
  done
done
alias_hop() { hop https vexeltechsolutions.com "$1" "$CANON$2"; hop http www.vexeltechsolutions.com "$1" "$CANON$2"; }
alias_hop /about /about-us
alias_hop /about/ /about-us
alias_hop /contact /contact-us
alias_hop /packages /pricing
alias_hop /thanks.html /thanks
alias_hop /privacy.html /privacy-policy
alias_hop /terms.html /terms-of-service
alias_hop /services/branding /services#branding
alias_hop /websites /services#websites
alias_hop /services/web-development/ /services#websites
alias_hop /marketing /services#marketing
alias_hop /automation /services#automation
alias_hop /blog /
alias_hop /portfolio /
alias_hop /case-studies/x /
alias_hop /legacy/contact /

echo "== 4. Security headers"
if [ "$MODE" = live ]; then H=$(curl -sI "$CANON/"); else H=$(curl -sI -H 'Host: vexeltechsolutions.com' "$LOCAL/"); fi
chk() { echo "$H" | grep -qi "^$1: $2" && pass "$1: $2" || fail "$1 missing or not '$2'"; }
chk strict-transport-security "max-age=31536000"
echo "$H" | grep -qi "^strict-transport-security:.*\(includesubdomains\|preload\)" && fail "HSTS carries includeSubDomains or preload" || pass "HSTS without includeSubDomains or preload"
chk x-content-type-options nosniff
chk referrer-policy strict-origin-when-cross-origin
chk permissions-policy "camera=(), microphone=(), geolocation=()"
chk content-security-policy-report-only "default-src 'self'"
if [ "$MODE" = local ]; then
  H2=$(curl -sI -H 'Host: vexeltechsolutions.com' -H 'X-Forwarded-Proto: http' "$LOCAL/")
  echo "$H2" | grep -qi '^strict-transport-security' && fail "HSTS sent over http" || pass "no HSTS over http"
fi

echo "== 5 and 6. Caching and compression"
if [ "$MODE" = live ]; then B="$CANON"; HH=(); else B="$LOCAL"; HH=(-H 'Host: vexeltechsolutions.com'); fi
home=$(curl -s "${HH[@]}" "$B/")
css=$(echo "$home" | grep -o '/assets/style-[^"]*\.css' | head -1)
js=$(echo "$home" | grep -o '/assets/index-[^"]*\.js' | head -1)
font=$(echo "$home" | grep -o '/assets/[a-z-]*-variable-[^"]*\.woff2' | head -1)
img=$(echo "$home" | grep -o '/assets/hero-spot-first-[^"]*\.webp' | head -1)
# The film's file name is in home's chunk, named in the boot file's route map.
boot=$(echo "$home" | grep -o '/assets/boot-[^"]*\.js' | head -1)
homejs=$(curl -s "${HH[@]}" "$B$boot" --compressed | grep -o '"/":\["[^"]*"' | grep -o '/assets/[^"]*')
vid=$(curl -s "${HH[@]}" "$B$homejs" --compressed | grep -o 'assets/hero-spot-m-[A-Za-z0-9_-]*\.mp4' | head -1)
head_of() { curl -s -D - -o /dev/null -H 'Accept-Encoding: br, gzip' "${HH[@]}" "$B$1"; }
cc() { head_of "$1" | grep -i '^cache-control:' | tr -d '\r' | cut -d' ' -f2-; }
ce() { head_of "$1" | grep -i '^content-encoding:' | tr -d '\r' | cut -d' ' -f2-; }
[ "$(cc /)" = "no-cache" ] && pass "HTML Cache-Control no-cache" || fail "HTML Cache-Control: $(cc /)"
for a in "$css" "$js" "$font" "$img"; do
  [ -z "$a" ] && { fail "asset not found in the home page"; continue; }
  [ "$(cc "$a")" = "public, max-age=31536000, immutable" ] && pass "immutable $a" || fail "$a Cache-Control: $(cc "$a")"
done
for a in / "$css" "$js"; do
  e=$(ce "$a"); case "$e" in br|gzip) pass "$e on $a";; *) fail "no compression on $a";; esac
done
for a in "$font" "$img" "/$vid"; do
  e=$(ce "$a"); [ -z "$e" ] && pass "uncompressed $a" || fail "$e on $a (media and woff2 must not be)"
done

echo
echo "$FAIL failed"
exit "$FAIL"
