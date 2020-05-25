<template>
  <input
    v-bind="$attrs"
    :value="value"
    type="radio"
    class="ticket-btn"
    @change="$emit('change', $event.target.value)"
  >
</template>

<script>
export default {
  name: 'Ticket',
  props: {
    value: {
      type: Number,
      default: null
    }
  }
}
</script>
