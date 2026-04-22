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
          primary: '#5B8FD4',
          secondary: '#6A8299',
          accent: '#5B8FD4',
          background: '#0f1117',
          surface: '#181920',
          error: '#C84B5B',
          info: '#5B8FD4',
          success: '#3D9D5C',
          warning: '#C97A25',
        },
      },
    },
  },
});

const app = createApp(App);
app.use(vuetify);
app.mount('#app');
