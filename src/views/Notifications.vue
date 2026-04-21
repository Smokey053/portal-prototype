<template>
  <div>
    <v-card color="surface" rounded="xl" class="pa-4">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-4 flex-wrap gap-2">
        <div class="text-subtitle-1 font-weight-bold d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-bell-outline</v-icon>
          Notifications
          <v-badge :content="unreadCount" :model-value="unreadCount > 0" color="error" class="ml-3"></v-badge>
        </div>
        <v-btn variant="tonal" color="primary" size="small" prepend-icon="mdi-check-all" @click="markAllRead">
          Mark all read
        </v-btn>
      </div>

      <!-- Tabs -->
      <v-tabs v-model="tab" color="primary" density="compact" class="mb-4">
        <v-tab value="all">
          All
          <v-chip size="x-small" class="ml-1" color="surface" variant="outlined">{{ allNotifications.length }}</v-chip>
        </v-tab>
        <v-tab v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
          <v-chip size="x-small" class="ml-1" color="surface" variant="outlined">{{ countByCategory(cat) }}</v-chip>
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <!-- All tab -->
        <v-window-item value="all">
          <div v-if="allNotifications.length === 0" class="text-center text-grey py-8">
            <v-icon size="48" class="mb-2 d-block">mdi-bell-off</v-icon>
            No notifications
          </div>
          <v-list lines="three" density="compact">
            <v-list-item
              v-for="n in allNotifications"
              :key="n.id"
              :prepend-icon="n.icon"
              :active="!n.read"
              active-color="primary"
              class="rounded-xl mb-2"
              style="background:rgba(255,255,255,0.03)"
            >
              <template v-slot:title>
                <span :class="n.read ? 'text-medium-emphasis' : 'font-weight-bold'">{{ n.title }}</span>
              </template>
              <template v-slot:subtitle>
                {{ n.body }}
              </template>
              <template v-slot:append>
                <div class="d-flex flex-column align-end">
                  <v-icon v-if="!n.read" color="primary" size="x-small" class="mb-1">mdi-circle</v-icon>
                  <span class="text-caption text-grey">{{ formatTime(n.timestamp) }}</span>
                  <v-chip size="x-small" :color="catColor(n.category)" variant="tonal" class="mt-1">{{ n.category }}</v-chip>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-window-item>

        <!-- Category tabs -->
        <v-window-item v-for="cat in categories" :key="cat" :value="cat">
          <v-list lines="three" density="compact">
            <v-list-item
              v-for="n in filteredByCategory(cat)"
              :key="n.id"
              :prepend-icon="n.icon"
              :active="!n.read"
              active-color="primary"
              class="rounded-xl mb-2"
              style="background:rgba(255,255,255,0.03)"
            >
              <template v-slot:title>
                <span :class="n.read ? 'text-medium-emphasis' : 'font-weight-bold'">{{ n.title }}</span>
              </template>
              <template v-slot:subtitle>{{ n.body }}</template>
              <template v-slot:append>
                <div class="d-flex flex-column align-end">
                  <v-icon v-if="!n.read" color="primary" size="x-small" class="mb-1">mdi-circle</v-icon>
                  <span class="text-caption text-grey">{{ formatTime(n.timestamp) }}</span>
                </div>
              </template>
            </v-list-item>
          </v-list>
          <div v-if="filteredByCategory(cat).length === 0" class="text-caption text-grey text-center py-6">No {{ cat }} notifications</div>
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import student from '../data/studentData';

const tab = ref('all');
const notifications = ref([...student.notifications]);

const allNotifications = computed(() => notifications.value.slice().sort((a,b) => b.timestamp.localeCompare(a.timestamp)));
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);
const categories = ['Announcements', 'Finance', 'Attendance', 'Registration', 'System'];

const countByCategory = (cat) => notifications.value.filter(n => n.category === cat).length;
const filteredByCategory = (cat) => allNotifications.value.filter(n => n.category === cat);
const markAllRead = () => notifications.value.forEach(n => n.read = true);

const catColor = (cat) => ({
  Announcements: 'primary', Finance: 'error', Attendance: 'warning',
  Registration: 'success', System: 'grey',
})[cat] ?? 'grey';

const formatTime = (ts) => {
  const d = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
  if (diff < 86400) return Math.floor(diff / 3600) + ' hr ago';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
</script>
