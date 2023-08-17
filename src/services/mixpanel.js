import mixpanel from 'mixpanel-browser';

mixpanel.init('YOUR_MIXPANEL_TOKEN');

let isProduction = process.env.NODE_ENV === 'production';

export let Mixpanel = {
  init() {
    this.track('INFO', {
      os: navigator.userAgentData.platform,
      width: window.innerWidth,
      height: window.innerHeight,
    })
  },
  trackPageView(pageName) {
    if (isProduction) mixpanel.track_pageview('[Legacy][Web] ' + pageName);
  },
  track(action, payload) {
    if (isProduction) mixpanel.track('[Legacy][Web] ' + action, payload);
  },
  logout() {
    mixpanel.reset();
  }
};
