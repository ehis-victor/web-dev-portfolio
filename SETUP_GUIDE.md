# Quick Setup Guide: Analytics & Rate Limiting

## What's New?

Your portfolio now includes:

1. **Rate Limiting** - Prevents API abuse (15 messages/minute max)
2. **Analytics Tracking** - Optional Google Analytics integration
3. **Link Tracking** - Tracks all external clicks (LinkedIn, GitHub, email, project links)
4. **Modal Tracking** - Tracks when users open features

## For Development (Local)

No additional setup needed! Everything works out of the box:

```bash
npm run dev
```

You'll see analytics logs in console:

```
[Analytics] Event tracked (demo mode): page_view ...
```

## For Production (Netlify)

### Step 1: Essential Setup (Required)

In Netlify Dashboard → Site Settings → Build & Deploy → Environment:

```
VITE_GEMINI_API_KEY = your-gemini-api-key
```

✅ This is all you need for the site to work with rate limiting.

### Step 2: Optional - Google Analytics Setup

If you want real analytics tracking:

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create new GA4 property for your portfolio
3. Get your Measurement ID (looks like: `G-XXXXXXXXXX`)
4. Add to Netlify environment variables:
   ```
   VITE_GA_MEASUREMENT_ID = G-XXXXXXXXXX
   ```
5. Deploy and wait 24-48 hours for data to appear

**Without this**, analytics logs to console (demo mode) - site still works perfectly.

## How It Works

### Rate Limiting

- **Limit**: 15 messages per 60 seconds
- **When exceeded**: User sees: `⏱️ I'm getting a lot of requests right now. Please try again in X seconds.`
- **No configuration needed** - always active

### Analytics Events (Automatic)

The app automatically tracks:

- ✅ Page views
- ✅ Chat messages sent
- ✅ Project filters applied
- ✅ New projects added
- ✅ Theme toggles
- ✅ Modal opens (chat, skills, add project)
- ✅ All external link clicks

## Testing

### Test Rate Limiting (Local)

1. Open the chat widget
2. Send 15+ messages rapidly
3. After 15 messages, you'll see timeout message
4. Wait ~60 seconds, then can send more

### Test Analytics (Local)

Open DevTools Console and look for:

```
[Analytics] Event tracked (demo mode): ...
```

### Test Analytics (Production)

1. Deploy to Netlify with GA Measurement ID
2. Visit your deployed site
3. Go to Google Analytics → Real Time → Events
4. Perform actions on site (filter, chat, click links)
5. See events appear in Real Time dashboard

## Environment Variables Reference

| Variable                 | Required | Default | Purpose                      |
| ------------------------ | -------- | ------- | ---------------------------- |
| `VITE_GEMINI_API_KEY`    | Yes      | -       | Google Gemini API key        |
| `VITE_GA_MEASUREMENT_ID` | No       | -       | Google Analytics tracking ID |

## Files Changed

New files:

- `services/rateLimiter.ts` - Rate limiting service
- `services/analytics.ts` - Analytics service
- `ANALYTICS_TRACKING.md` - Complete tracking documentation
- `IMPLEMENTATION_SUMMARY.md` - Implementation details

Modified files:

- `App.tsx` - Added analytics tracking (7 points)
- `ChatWidget.tsx` - Chat widget tracking
- `AddProjectModal.tsx` - Modal tracking
- `SkillsModal.tsx` - Modal tracking
- `ProjectCard.tsx` - Link tracking
- `geminiService.ts` - Rate limiting + analytics
- `ErrorBoundary.tsx` - TypeScript fix
- `.env.example` - GA_MEASUREMENT_ID docs

## Troubleshooting

### "I'm getting lots of requests" message

- This is the rate limiter working correctly
- Wait 60 seconds and try again
- Normal behavior during heavy usage

### Analytics not appearing in Google Analytics

- Check that GA Measurement ID is correct
- Allow 24-48 hours for first data
- Check DevTools Network tab for gtag requests
- Verify GA property is set to receive data

### Console shows "demo mode" messages

- Normal in development without GA setup
- To test real GA: Set VITE_GA_MEASUREMENT_ID locally
- In production: Set it in Netlify environment variables

## Next Steps

1. ✅ Code is ready (all tests passing)
2. Deploy to GitHub
3. Connect GitHub repo to Netlify
4. Add `VITE_GEMINI_API_KEY` to Netlify environment variables
5. (Optional) Add `VITE_GA_MEASUREMENT_ID` if you want analytics
6. Deploy and test!

## Support

For full details on analytics events and tracking points, see `ANALYTICS_TRACKING.md`

For implementation details, see `IMPLEMENTATION_SUMMARY.md`
