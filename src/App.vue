<template>
  <v-app :theme="'dark'">
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      color="surface"
      :permanent="mdAndUp"
      :temporary="!mdAndUp"
    >
      <!-- Logo / Branding -->
      <v-list-item
        prepend-icon="mdi-school"
        title="LUCT PORTAL"
        :subtitle="rail ? '' : 'Student Access'"
        class="py-4"
        style="border-bottom: 1px solid rgba(255,255,255,0.08)"
      >
        <template v-if="mdAndUp" v-slot:append>
          <v-btn
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            variant="text"
            @click="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-list density="compact" nav class="mt-2">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.path"
          :active="currentViewName === item.path"
          active-color="primary"
          rounded="lg"
          class="mb-1"
          @click="navigate(item.path)"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider></v-divider>
        <div class="pa-3">
          <v-btn
            block
            :prepend-icon="rail ? undefined : 'mdi-logout'"
            :icon="rail ? 'mdi-logout' : undefined"
            color="error"
            variant="tonal"
            size="small"
          >{{ rail ? '' : 'Logout' }}</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar flat color="surface" border="b">
      <v-app-bar-nav-icon
        v-if="!mdAndUp"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-app-bar-title class="font-weight-bold text-body-1">
        <span class="text-primary">{{ currentViewTitle }}</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Notifications Bell -->
      <v-menu transition="slide-y-transition" :close-on-content-click="false" max-width="380">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="mr-1">
            <v-badge :content="unreadCount" :model-value="unreadCount > 0" color="error">
              <v-icon>mdi-bell-outline</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <v-card color="surface" border width="380">
          <v-card-title class="d-flex align-center py-3 px-4">
            <span class="text-subtitle-2">Notifications</span>
            <v-spacer></v-spacer>
            <v-btn variant="text" size="x-small" color="primary">Mark all read</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-list lines="two" max-height="320" style="overflow-y:auto">
            <v-list-item
              v-for="n in recentNotifications"
              :key="n.id"
              :prepend-icon="n.icon"
              :title="n.title"
              :subtitle="n.body"
              :active="!n.read"
              active-color="primary"
            >
              <template v-slot:append>
                <v-icon v-if="!n.read" color="primary" size="x-small">mdi-circle</v-icon>
              </template>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn block variant="text" color="primary" @click="navigate('Notifications')">View All</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>

      <!-- Student Avatar -->
      <v-avatar size="36" color="primary" class="mr-3" style="cursor:pointer" @click="navigate('Profile')">
        <span class="text-body-2 font-weight-bold text-white">EY</span>
      </v-avatar>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-4 pa-md-6">
        <component :is="currentView"></component>
      </v-container>
    </v-main>

    <!-- Mobile bottom padding spacer -->
    <div v-if="!mdAndUp" style="height:16px"></div>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import Dashboard from './views/Dashboard.vue';
import Profile from './views/Profile.vue';
import Finance from './views/Finance.vue';
import Timetable from './views/Timetable.vue';
import Notifications from './views/Notifications.vue';
import Attendance from './views/Attendance.vue';
import Calendar from './views/Calendar.vue';
import Results from './views/Results.vue';
import Registration from './views/Registration.vue';
import Support from './views/Support.vue';
import studentData from './data/studentData';

const { mdAndUp } = useDisplay();

const drawer = ref(true);
const rail = ref(false);
const currentViewName = ref('Dashboard');

const views = {
  Dashboard, Profile, Finance, Timetable, Notifications,
  Attendance, Calendar, Results, Registration, Support
};

const menuItems = [
  { title: 'Dashboard',         icon: 'mdi-view-dashboard-outline', path: 'Dashboard' },
  { title: 'Profile',           icon: 'mdi-account-outline',        path: 'Profile' },
  { title: 'Timetable',         icon: 'mdi-calendar-clock-outline', path: 'Timetable' },
  { title: 'Attendance',        icon: 'mdi-chart-box-outline',      path: 'Attendance' },
  { title: 'Results',           icon: 'mdi-certificate-outline',    path: 'Results' },
  { title: 'Registration',      icon: 'mdi-pencil-box-outline',     path: 'Registration' },
  { title: 'Academic Calendar', icon: 'mdi-calendar-month-outline', path: 'Calendar' },
  { title: 'Finance',           icon: 'mdi-cash-multiple',          path: 'Finance' },
  { title: 'Notifications',     icon: 'mdi-bell-outline',           path: 'Notifications' },
  { title: 'Support',           icon: 'mdi-lifebuoy',               path: 'Support' },
];

const currentView = computed(() => views[currentViewName.value]);
const currentViewTitle = computed(() => menuItems.find(m => m.path === currentViewName.value)?.title ?? currentViewName.value);

const unreadCount = computed(() => studentData.notifications.filter(n => !n.read).length);
const recentNotifications = computed(() => studentData.notifications.slice(0, 4));

const navigate = (path) => {
  currentViewName.value = path;
  if (!mdAndUp.value) drawer.value = false;
};
</script>

<style scoped>
.v-navigation-drawer {
  border-right: 1px solid #333 !important;
}
</style>
