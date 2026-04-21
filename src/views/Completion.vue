<template>
  <div class="d-flex flex-column align-center justify-center fill-height py-10">
    <v-card color="surface" variant="outlined" class="pa-10 text-center" max-width="600">
      <v-icon size="64" color="accent" class="mb-4">mdi-shield-check</v-icon>
      <h2 class="text-h4 font-weight-bold mb-4">Prototype Complete</h2>
      <p class="text-body-1 text-grey mb-8">
        All 10 University Student Portal modules have been implemented.
        The prototype is responsive and follows the requested black/slate-grey dark theme.
      </p>
      <v-btn color="accent" size="large" variant="elevated" @click="restart">Restart Experience</v-btn>
    </v-card>
  </div>
</template>

<script setup>
const restart = () => {
  window.location.reload();
};
</script>
