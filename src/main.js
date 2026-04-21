import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import App from './App.vue';

const vuetify = createVuetify({
  components,
  directives,
  icons: { defaultSet: 'mdi' },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#4A7EC3',
          secondary: '#718FA6',
          accent: '#4A7EC3',
          background: '#121212',
          surface: '#1E1E1E',
          error: '#C84B5B',
          info: '#4A90B8',
          success: '#4CAF50',
          warning: '#D97820',
        },
      },
    },
  },
});

const app = createApp(App);
app.use(vuetify);
app.mount('#app');
