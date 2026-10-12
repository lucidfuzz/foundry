#!/usr/bin/env python3
"""Bundle the widget fonts into the Android app (assets/runtime/fonts) from pinned @fontsource packages.

Run from the repo root:  python3 android/scripts/fetch_fonts.py
It downloads each package tarball from the npm registry, checks it against the pinned sha512, copies the chosen .woff2
files and the package licence (all are SIL Open Font License 1.1), and rewrites the @font-face rules in
assets/runtime/index.html between the "fonts:start" and "fonts:end" markers. The family names are the ones
foundry-runtime.js draws with, so the runtime's font mapping (FRAME_DISPLAY, NAME_FONT, MONO, SANS) finds them.
The fetched files are committed, so builds never need the network for fonts.
"""
import base64, hashlib, io, os, re, sys, tarfile, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # android/
ASSETS = os.path.join(ROOT, 'app', 'src', 'main', 'assets', 'runtime')
FONTS = os.path.join(ASSETS, 'fonts')
PAGE = os.path.join(ASSETS, 'index.html')

# package, version, npm integrity, family name used by the runtime, files to bundle
PACKAGES = [
    ('@fontsource-variable/newsreader', '5.3.0',
     'sha512-rrzYi43qMpbzwuFtf9OkWH8sxAPVPcQQQEwXpPtwaKYeJ8yVg5aLs5kawmo1f2Q1t1M38TLmEKCkGVDsYwgdFw==',
     'Newsreader', ['newsreader-latin-opsz-normal', 'newsreader-latin-ext-opsz-normal', 'newsreader-latin-opsz-italic']),
    ('@fontsource-variable/archivo', '5.3.0',
     'sha512-HogK8FJelrD1o7TlZlkIVtHgc20bO5PZRWE7mUeUTdMN055alznQV6/00J00IBeu8FQAH4s3zW9UJNvKExXf+g==',
     'Archivo', ['archivo-latin-wdth-normal', 'archivo-latin-ext-wdth-normal', 'archivo-latin-wdth-italic']),
    ('@fontsource/ibm-plex-mono', '5.3.0',
     'sha512-eTgnZjZEGk1QtD3ZstF+Vclo2HLAni8YMy34/DxllwZvyz1lR/1RF/xTiAquOBO7MvqBx8D2Ig2WCPMVfdZu7Q==',
     'IBM Plex Mono', ['ibm-plex-mono-latin-%d-normal' % w for w in (300, 400, 500, 600, 700)] +
                      ['ibm-plex-mono-latin-ext-%d-normal' % w for w in (400, 500, 700)]),
    ('@fontsource/barlow-condensed', '5.3.0',
     'sha512-RA7MmIx0v3eQ6Gcf74qLVLOwLB0GpPOzx+eU9iG/AmCnSJGcIWYeU8y6CEMGZ210MGwGg5CZhzLkkvyZdTTk1g==',
     'Barlow Condensed', ['barlow-condensed-latin-%d-normal' % w for w in (500, 600, 700)]),
]


def fetch(pkg, version, integrity):
    name = pkg.split('/')[1]
    url = 'https://registry.npmjs.org/%s/-/%s-%s.tgz' % (pkg, name, version)
    data = urllib.request.urlopen(url, timeout=60).read()
    got = 'sha512-' + base64.b64encode(hashlib.sha512(data).digest()).decode()
    if got != integrity:
        sys.exit('%s@%s: integrity mismatch\n  expected %s\n  got      %s' % (pkg, version, integrity, got))
    return tarfile.open(fileobj=io.BytesIO(data), mode='r:gz')


def faces_from_css(tar):
    """file stem -> dict of the @font-face properties fontsource declares for it."""
    faces = {}
    for m in tar.getmembers():
        if not (m.isfile() and m.name.endswith('.css')):
            continue
        css = tar.extractfile(m).read().decode('utf-8')
        for block in re.findall(r'@font-face\s*{([^}]*)}', css):
            src = re.search(r'url\(\./files/([^)]+?)\.woff2\)', block)
            if not src:
                continue
            props = dict((k.strip(), v.strip()) for k, v in re.findall(r'([a-z-]+)\s*:\s*([^;]+);', block))
            faces.setdefault(src.group(1), props)
    return faces


def main():
    os.makedirs(FONTS, exist_ok=True)
    for f in os.listdir(FONTS):
        os.remove(os.path.join(FONTS, f))
    rules = []
    for pkg, version, integrity, family, stems in PACKAGES:
        tar = fetch(pkg, version, integrity)
        faces = faces_from_css(tar)
        short = pkg.split('/')[1]
        lic = next(m for m in tar.getmembers() if m.name in ('package/LICENSE', 'package/LICENSE.md', 'package/OFL.txt'))
        with open(os.path.join(FONTS, 'LICENSE-%s.txt' % short), 'wb') as out:
            out.write(tar.extractfile(lic).read())
        for stem in stems:
            member = tar.getmember('package/files/%s.woff2' % stem)
            with open(os.path.join(FONTS, stem + '.woff2'), 'wb') as out:
                out.write(tar.extractfile(member).read())
            p = faces.get(stem)
            if p is None:
                sys.exit('%s: no @font-face found for %s' % (pkg, stem))
            variable = 'variations' in p.get('src', '')
            lines = ['font-family: "%s"' % family, 'font-style: %s' % p.get('font-style', 'normal'),
                     'font-weight: %s' % p.get('font-weight', '400')]
            if p.get('font-stretch'):
                lines.append('font-stretch: %s' % p['font-stretch'])
            lines += ['font-display: block',
                      'src: url(fonts/%s.woff2) format("%s")' % (stem, 'woff2-variations' if variable else 'woff2'),
                      'unicode-range: %s' % p['unicode-range']]
            rules.append('@font-face { %s; }' % '; '.join(lines))
        print('%s@%s: %d files' % (pkg, version, len(stems)))
    page = open(PAGE, encoding='utf-8').read()
    block = '/* fonts:start (written by android/scripts/fetch_fonts.py) */\n' + '\n'.join(rules) + '\n/* fonts:end */'
    page, n = re.subn(r'/\* fonts:start[\s\S]*?fonts:end \*/', lambda _: block, page)
    if n != 1:
        sys.exit('index.html: fonts:start / fonts:end markers not found')
    open(PAGE, 'w', encoding='utf-8').write(page)
    print('Wrote %d @font-face rules into %s' % (len(rules), os.path.relpath(PAGE)))


if __name__ == '__main__':
    main()
