<template>
  <div>
    <v-card class="section-card pa-4" rounded="lg">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-4 flex-wrap" style="gap:8px">
        <div class="d-flex align-center" style="gap:10px">
          <span class="section-label">Notifications</span>
          <span v-if="unreadCount > 0" class="unread-count">{{ unreadCount }}</span>
        </div>
        <v-btn variant="text" size="small" style="font-size:11px; opacity:0.55" @click="markAllRead">
          Mark all read
        </v-btn>
      </div>

      <!-- Tabs -->
      <v-tabs v-model="tab" color="primary" density="compact" class="mb-4" style="border-bottom: 1px solid rgba(255,255,255,0.06)">
        <v-tab value="all" style="font-size:12px; text-transform:none; letter-spacing:0">
          All <span class="tab-count">{{ allNotifications.length }}</span>
        </v-tab>
        <v-tab v-for="cat in categories" :key="cat" :value="cat" style="font-size:12px; text-transform:none; letter-spacing:0">
          {{ cat }} <span class="tab-count">{{ countByCategory(cat) }}</span>
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <!-- All tab -->
        <v-window-item value="all">
          <div v-if="allNotifications.length === 0" class="text-center field-label py-8">No notifications</div>
          <div
            v-for="n in allNotifications"
            :key="n.id"
            class="notif-row"
            :class="{ 'notif-unread': !n.read }"
          >
            <div class="d-flex align-start" style="gap:12px">
              <v-icon size="16" :color="catHex(n.category)" style="margin-top:2px; flex-shrink:0">{{ n.icon }}</v-icon>
              <div class="flex-grow-1">
                <div class="notif-title" :class="{ 'notif-bold': !n.read }">{{ n.title }}</div>
                <div class="notif-body">{{ n.body }}</div>
              </div>
              <div class="d-flex flex-column align-end" style="gap:4px; flex-shrink:0">
                <div v-if="!n.read" class="unread-dot"></div>
                <span class="notif-time">{{ formatTime(n.timestamp) }}</span>
                <span class="cat-badge" :style="{ background: catBg(n.category), color: catHex(n.category) }">{{ n.category }}</span>
              </div>
            </div>
          </div>
        </v-window-item>

        <!-- Category tabs -->
        <v-window-item v-for="cat in categories" :key="cat" :value="cat">
          <div v-if="filteredByCategory(cat).length === 0" class="field-label text-center py-6">No {{ cat }} notifications</div>
          <div
            v-for="n in filteredByCategory(cat)"
            :key="n.id"
            class="notif-row"
            :class="{ 'notif-unread': !n.read }"
          >
            <div class="d-flex align-start" style="gap:12px">
              <v-icon size="16" :color="catHex(n.category)" style="margin-top:2px; flex-shrink:0">{{ n.icon }}</v-icon>
              <div class="flex-grow-1">
                <div class="notif-title" :class="{ 'notif-bold': !n.read }">{{ n.title }}</div>
                <div class="notif-body">{{ n.body }}</div>
              </div>
              <div class="d-flex flex-column align-end" style="gap:4px; flex-shrink:0">
                <div v-if="!n.read" class="unread-dot"></div>
                <span class="notif-time">{{ formatTime(n.timestamp) }}</span>
              </div>
            </div>
          </div>
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

const catHex = (cat) => ({
  Announcements: '#5B8FD4', Finance: '#C84B5B', Attendance: '#C97A25',
  Registration: '#3D9D5C', System: 'rgba(255,255,255,0.35)',
})[cat] ?? 'rgba(255,255,255,0.35)';

const catBg = (cat) => ({
  Announcements: 'rgba(91,143,212,0.12)', Finance: 'rgba(200,75,91,0.12)', Attendance: 'rgba(201,122,37,0.12)',
  Registration: 'rgba(61,157,92,0.12)', System: 'rgba(255,255,255,0.06)',
})[cat] ?? 'rgba(255,255,255,0.06)';

const formatTime = (ts) => {
  const d = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
  if (diff < 86400) return Math.floor(diff / 3600) + ' hr ago';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
</script>

<style scoped>
.section-card  { border: 1px solid rgba(255,255,255,0.06); }
.section-label { font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.87); }
.field-label   { font-size: 10px; color: rgba(255,255,255,0.38); text-transform: uppercase; letter-spacing: 0.7px; }

.unread-count {
  font-size: 10px; font-weight: 700; background: #C84B5B;
  color: #fff; padding: 2px 7px; border-radius: 10px;
}
.tab-count {
  font-size: 10px; background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.4); padding: 1px 6px; border-radius: 8px;
  margin-left: 5px;
}

/* Notification rows */
.notif-row {
  padding: 11px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.notif-row:last-of-type { border-bottom: none; }
.notif-unread { background: rgba(255,255,255,0.015); border-radius: 6px; padding: 11px 8px; margin: 0 -8px; }
.notif-title  { font-size: 13px; color: rgba(255,255,255,0.75); }
.notif-bold   { font-weight: 600; color: rgba(255,255,255,0.9); }
.notif-body   { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 3px; line-height: 1.4; }
.notif-time   { font-size: 10px; color: rgba(255,255,255,0.3); white-space: nowrap; }
.cat-badge    { font-size: 9px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; padding: 2px 6px; border-radius: 5px; white-space: nowrap; }
.unread-dot   { width: 7px; height: 7px; border-radius: 50%; background: #5B8FD4; }
</style>
