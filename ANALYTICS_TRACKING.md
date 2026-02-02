# Analytics Tracking Documentation

This document outlines all analytics tracking points implemented in the DevFolio portfolio application.

## Overview

The application uses Google Analytics to track user interactions and behavior. Analytics tracking is **optional** and works in two modes:

- **Production Mode**: When `VITE_GA_MEASUREMENT_ID` is configured, events are sent to Google Analytics
- **Demo Mode**: Without GA configuration, events are logged to the browser console for development/testing

## Environment Configuration

To enable Google Analytics tracking:

1. Get your Google Analytics Measurement ID (format: `G-XXXXXXXXXX`)
2. Add to `.env.local`:
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
3. For Netlify deployment, add the same variable to your Netlify environment variables

## Tracking Points

### 1. Page View Tracking

**Location**: `App.tsx` - useEffect on mount

```typescript
analytics.trackPageView(window.location.pathname);
```

- **Event Name**: `page_view`
- **Parameters**:
  - `page_path`: Current page URL path
  - `page_title`: Document title
- **Trigger**: Once when app loads

### 2. Project Filter Tracking

**Location**: `App.tsx` - When user filters projects

```typescript
analytics.trackProjectFilter(status);
```

- **Event Name**: `project_filter`
- **Parameters**:
  - `filter_type`: Filter status (e.g., "Completed", "In Progress")
- **Trigger**: Each time user changes project filter

### 3. Project Addition Tracking

**Location**: `App.tsx` - When user adds a new project

```typescript
analytics.trackProjectAdded(formData.title);
```

- **Event Name**: `project_added`
- **Parameters**:
  - `project_name`: Title of the project added
- **Trigger**: When project form is submitted successfully

### 4. Theme Toggle Tracking

**Location**: `App.tsx` - When user toggles dark/light mode

```typescript
const handleThemeToggle = () => {
  theme.toggle();
  const newTheme = theme.isDark ? "light" : "dark";
  analytics.trackThemeToggle(newTheme);
};
```

- **Event Name**: `theme_toggled`
- **Parameters**:
  - `theme`: New theme mode ("dark" or "light")
- **Trigger**: Each time user clicks theme toggle button

### 5. Chat Widget Opening

**Location**: `ChatWidget.tsx` - When user opens chat

```typescript
useEffect(() => {
  if (isOpen) {
    scrollToBottom();
    analytics.trackModalOpen("chat_widget");
  }
}, [isOpen, messages]);
```

- **Event Name**: `modal_opened`
- **Parameters**:
  - `modal_name`: "chat_widget"
- **Trigger**: When chat widget is opened

### 6. Chat Message Tracking

**Location**: `geminiService.ts` - When user sends message to Veek Bot

```typescript
analytics.trackChatMessage(userMessage.length);
```

- **Event Name**: `veek_bot_chat`
- **Parameters**:
  - `message_length`: Length of user's message in characters
  - `timestamp`: ISO timestamp of the message
- **Trigger**: Each message sent to AI (rate limited to 15/minute)

### 7. Add Project Modal Tracking

**Location**: `AddProjectModal.tsx` - When user opens project form

```typescript
if (isOpen) {
  analytics.trackModalOpen("add_project");
}
```

- **Event Name**: `modal_opened`
- **Parameters**:
  - `modal_name`: "add_project"
- **Trigger**: When modal is opened

### 8. Skills Modal Tracking

**Location**: `SkillsModal.tsx` - When user opens skills/certifications

```typescript
if (isOpen) {
  analytics.trackModalOpen("skills");
}
```

- **Event Name**: `modal_opened`
- **Parameters**:
  - `modal_name`: "skills"
- **Trigger**: When modal is opened

### 9. External Link Tracking

#### 9a. LinkedIn

**Location**: `App.tsx` - Footer section

```typescript
onClick={() => analytics.trackExternalLink(LINKEDIN_URL, 'linkedin')}
```

#### 9b. GitHub

**Location**: `App.tsx` - Footer section

```typescript
onClick={() => analytics.trackExternalLink(GITHUB_URL, 'github')}
```

#### 9c. Email Contact (Header)

**Location**: `App.tsx` - Contact section

```typescript
onClick={() => analytics.trackExternalLink(CONTACT_EMAIL, 'email_contact')}
```

#### 9d. Email Contact (Footer)

**Location**: `App.tsx` - Footer

```typescript
onClick={() => analytics.trackExternalLink(CONTACT_EMAIL, 'email_footer')}
```

#### 9e. Project Demo Links

**Location**: `ProjectCard.tsx` - Each project card

```typescript
onClick={() => analytics.trackExternalLink(project.demoLink, `project_demo_${project.id}`)}
```

#### 9f. Project Repository Links

**Location**: `ProjectCard.tsx` - Each project card

```typescript
onClick={() => analytics.trackExternalLink(project.repoLink, `project_repo_${project.id}`)}
```

**All External Links**:

- **Event Name**: `external_link_click`
- **Parameters**:
  - `link_url`: The URL being visited
  - `link_label`: Identifier for the link (e.g., 'linkedin', 'github', 'project_demo_1')
- **Trigger**: When user clicks external link

## Analytics Service Methods

The `AnalyticsService` class (in `services/analytics.ts`) provides these methods:

### Core Methods

```typescript
// Track a custom event
trackEvent(event: AnalyticsEvent): void

// Track page view
trackPageView(pagePath: string): void

// Track chat message
trackChatMessage(messageLength: number): void

// Track project filter
trackProjectFilter(filter: string): void

// Track project addition
trackProjectAdded(projectTitle: string): void

// Track theme toggle
trackThemeToggle(newTheme: string): void

// Track external link click
trackExternalLink(url: string, label: string): void

// Track modal open
trackModalOpen(modalName: string): void

// Check if analytics is enabled
isAnalyticsEnabled(): boolean
```

## Viewing Analytics Data

### In Development (Demo Mode)

Open browser DevTools Console and look for logs like:

```
[Analytics] Event tracked (demo mode): page_view { page_path: "/", ... }
```

### In Production (With Google Analytics)

1. Go to your Google Analytics dashboard
2. Navigate to Real Time > Events
3. Look for custom events with names:
   - `page_view`
   - `project_filter`
   - `project_added`
   - `theme_toggled`
   - `modal_opened`
   - `veek_bot_chat`
   - `external_link_click`

## Rate Limiting Integration

The chat functionality is rate-limited to prevent API abuse:

- **Limit**: 15 messages per 60 seconds
- **When exceeded**: User receives message "I'm getting a lot of requests right now. Please try again in X seconds."
- **Analytics**: Message is tracked before rate limit check

## Best Practices

1. **Privacy**: Analytics tracks user behavior, not personal data
2. **Consent**: Consider adding a consent banner for GDPR compliance if your audience includes EU users
3. **Testing**: Use Demo Mode (no VITE_GA_MEASUREMENT_ID) for local development
4. **Production**: Always set VITE_GA_MEASUREMENT_ID in production environments

## Troubleshooting

### Events Not Appearing in Google Analytics

1. Check that `VITE_GA_MEASUREMENT_ID` is set correctly
2. Allow 24-48 hours for initial data to appear
3. Check browser DevTools Console for any errors
4. Verify in Chrome DevTools Network tab that requests are being sent to `www.googletagmanager.com`

### Console Shows Demo Mode Messages

This is normal in development. To test with real GA:

1. Set `VITE_GA_MEASUREMENT_ID` in `.env.local`
2. Rebuild the app
3. Check Network tab in DevTools for GA requests

## Future Enhancements

Potential tracking points to consider:

- User scroll depth
- Time spent on page
- Search/filter usage patterns
- Form abandonment tracking
- Download tracking (for resume/CV)
- Video playback if portfolio includes demos
