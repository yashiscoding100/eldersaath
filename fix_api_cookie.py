import re

with open('src/app/api/child/active-elder/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the cookie permissive (sameSite: "none", httpOnly: false)
old_cookie = '''cookieStore.set("activeElderId", elderId, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 // 30 days
      })'''

new_cookie = '''cookieStore.set("activeElderId", elderId, {
        path: "/",
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 // 30 days
      })'''

content = content.replace(old_cookie, new_cookie)

with open('src/app/api/child/active-elder/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Relaxed API route cookies")
