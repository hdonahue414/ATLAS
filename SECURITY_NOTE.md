# Password Protection

Password:
admin

Implementation:
- Frontend-only static password gate.
- Uses sessionStorage to persist unlocked state during current browser session.

Important:
This is lightweight deterrence, not real cryptographic security.
Anyone inspecting source code can discover the password.

For stronger protection on a static host:
- GitHub Pages + Cloudflare Access
- Netlify Identity
- Vercel password protection
- Basic auth on hosting layer
