"""Drive the user's Safari (logged in to the ODS Storybook) via osascript. Front window must be a Storybook tab."""
import subprocess, time, json
BASE = 'https://ods.trap.ng.telekom.net/'
def js(code, timeout=60):
    scr = 'tell application "Safari" to do JavaScript %s in current tab of window 1' % json.dumps(code)
    r = subprocess.run(['osascript', '-e', scr], capture_output=True, text=True, timeout=timeout)
    if r.returncode: raise RuntimeError(r.stderr)
    return r.stdout.rstrip('\n')
def go(url):
    subprocess.run(['osascript', '-e', 'tell application "Safari" to set URL of current tab of window 1 to %s' % json.dumps(url)], check=True)
    time.sleep(1.5)
    for _ in range(60):
        try: s = js("(location.href.indexOf('auth.devops')>=0?'AUTH':'')+(document.body&&document.body.classList.contains('sb-show-main')?'READY':'')")
        except Exception: s = ''
        if 'AUTH' in s: raise SystemExit('SSO login needed')
        if 'READY' in s: return
        time.sleep(0.5)
    raise RuntimeError('timeout ' + url)
def story(id, mode='story'): go(BASE + 'iframe.html?viewMode=%s&id=%s' % (mode, id))
