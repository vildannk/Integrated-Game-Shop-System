export const constant = {
   PROJECT_BASE_URL: (function () {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1') {
         return window.location.origin + '/diplomski/backend/';
      }
      return "https://integrated-game-shop-system-backend-production.up.railway.app/";
   })(),
   USER_ROLE: 'user',
   ADMIN_ROLE: 'admin'
}

if (typeof window !== 'undefined') {
   window.constant = constant;
}

