/**
 * Analytics Service
 * Tracks user interactions and page events using Google Analytics
 */

interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, string | number | boolean>;
}

class AnalyticsService {
  private isEnabled: boolean = false;
  private measurementId: string = "";

  constructor() {
    // Check if we're in production and measurement ID is available
    this.isEnabled =
      typeof window !== "undefined" &&
      import.meta.env.VITE_GA_MEASUREMENT_ID !== undefined;
    this.measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

    if (this.isEnabled) {
      this.initializeGoogleAnalytics();
    }
  }

  /**
   * Initialize Google Analytics
   */
  private initializeGoogleAnalytics(): void {
    // Load Google Analytics script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(arguments);
    }
    (window as any).gtag = gtag;
    gtag("js", new Date());
    gtag("config", this.measurementId);
  }

  /**
   * Track a custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isEnabled) {
      console.log(
        "[Analytics] Event tracked (demo mode):",
        event.name,
        event.parameters
      );
      return;
    }

    if ((window as any).gtag) {
      (window as any).gtag("event", event.name, event.parameters);
    }
  }

  /**
   * Track page view
   */
  trackPageView(pagePath: string): void {
    this.trackEvent({
      name: "page_view",
      parameters: {
        page_path: pagePath,
        page_title: document.title,
      },
    });
  }

  /**
   * Track chat message sent
   */
  trackChatMessage(messageLength: number): void {
    this.trackEvent({
      name: "veek_bot_chat",
      parameters: {
        message_length: messageLength,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Track project filter
   */
  trackProjectFilter(filter: string): void {
    this.trackEvent({
      name: "project_filter",
      parameters: {
        filter_type: filter,
      },
    });
  }

  /**
   * Track project added
   */
  trackProjectAdded(projectTitle: string): void {
    this.trackEvent({
      name: "project_added",
      parameters: {
        project_name: projectTitle,
      },
    });
  }

  /**
   * Track theme toggle
   */
  trackThemeToggle(newTheme: string): void {
    this.trackEvent({
      name: "theme_toggled",
      parameters: {
        theme: newTheme,
      },
    });
  }

  /**
   * Track external link click
   */
  trackExternalLink(url: string, label: string): void {
    this.trackEvent({
      name: "external_link_click",
      parameters: {
        link_url: url,
        link_label: label,
      },
    });
  }

  /**
   * Track modal open
   */
  trackModalOpen(modalName: string): void {
    this.trackEvent({
      name: "modal_opened",
      parameters: {
        modal_name: modalName,
      },
    });
  }

  /**
   * Check if analytics is enabled
   */
  isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }
}

// Create a singleton instance
export const analytics = new AnalyticsService();

export default AnalyticsService;
