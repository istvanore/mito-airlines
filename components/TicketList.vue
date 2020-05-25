<template>
  <div>
    <div v-if="selectedTicket.outBoundDepartureTime">
      <div class="ticket-summary__ticket">
        <div class="ticket-summary__ticket__date">
          <div class="ticket-summary__ticket__date__month">
            <div>{{ selectedFlight.outboundDate | month }}</div>
            <div>{{ selectedFlight.outboundDate | day }}</div>
          </div>
        </div>
        <div class="ticket-summary__ticket__info">
          <div>{{ selectedFlight.departureStation.shortName }} -</div>
          <div>{{ selectedFlight.arrivalStation.shortName }}</div>
          <div><span>{{ selectedFlight.outboundDate | dayname }}</span> <span>{{ selectedTicket.outBoundDepartureTime }}</span> - <span>{{ selectedTicket.outBoundArrivalTime }}</span></div>
        </div>
      </div>
    </div>
    <div v-if="returnTicket">
      <div class="ticket-summary__body__divider">
        <span>---------------</span>
      </div>
    </div>
    <div v-if="selectedTicket.inBoundDepartureTime">
      <div class="ticket-summary__ticket">
        <div class="ticket-summary__ticket__date">
          <div class="ticket-summary__ticket__date__month">
            <div>{{ selectedFlight.inboundDate | month }}</div>
            <div>{{ selectedFlight.inboundDate | day }}</div>
          </div>
        </div>
        <div class="ticket-summary__ticket__info">
          <div>{{ selectedFlight.arrivalStation.shortName }} -</div>
          <div>{{ selectedFlight.departureStation.shortName }}</div>

          <div><span>{{ selectedFlight.outboundDate | dayname }}</span> <span>{{ selectedTicket.outBoundDepartureTime }}</span> - <span>{{ selectedTicket.outBoundArrivalTime }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TicketList',
  props: {
    selectedFlight: {
      type: Object,
      default: null
    },
    selectedTicket: {
      type: Object,
      default: null
    }
  },
  computed: {
    returnTicket () {
      return this.selectedTicket.outBoundDepartureTime && this.selectedTicket.inBoundDepartureTime
    }
  }
}
</script>

<style>

</style>
