import mixpanel from 'mixpanel-browser';

let isProduction = process.env.NODE_ENV === 'production';

export let Mixpanel = {
  init() {
    if (isProduction) mixpanel.init('075d1512e69a60bfcd9f7352b21cc4a2');
  },
  trackPageView(pageName) {
    if (isProduction) mixpanel.track_pageview({ page: '[Legacy][Web] ' + pageName });
  },
  track(action, payload) {
    if (isProduction) mixpanel.track('[Legacy][Web] ' + action, payload);
  },
  login(userId) {
    if (isProduction) mixpanel.identify(userId);
  },
  logout() {
    mixpanel.reset();
  }
};
