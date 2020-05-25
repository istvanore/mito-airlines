<template>
  <div>
    <div v-if="selectedTicket.outBoundDepartureTime">
      <div class="ticket-summary__ticket">
        <div class="ticket-summary__ticket__date">
          <div class="ticket-summary__ticket__date__month">
            {{ selectedFlight.outboundDate | month }}
          </div>
          <div class="ticket-summary__ticket__date__day">
            {{ selectedFlight.outboundDate | day }}
          </div>
        </div>
        <div class="ticket-summary__ticket__info">
          <div>{{ selectedFlight.departureStation.shortName }} -</div>
          <div>{{ selectedFlight.arrivalStation.shortName }}</div>
          <div class="ticket-summary__ticket__info__small">
            <span>{{ selectedFlight.outboundDate | dayname }}</span> <span>{{ selectedTicket.outBoundDepartureTime | hoursMins }}</span> - <span>{{ selectedTicket.outBoundArrivalTime | hoursMins }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="returnTicket">
      <div class="ticket-summary__body__divider" />
    </div>
    <div v-if="selectedTicket.inBoundDepartureTime">
      <div class="ticket-summary__ticket">
        <div class="ticket-summary__ticket__date">
          <div class="ticket-summary__ticket__date__month">
            {{ selectedFlight.inboundDate | month }}
          </div>
          <div class="ticket-summary__ticket__date__day">
            {{ selectedFlight.inboundDate | day }}
          </div>
        </div>
        <div class="ticket-summary__ticket__info">
          <div>{{ selectedFlight.arrivalStation.shortName }} -</div>
          <div>{{ selectedFlight.departureStation.shortName }}</div>
          <div class="ticket-summary__ticket__info__small">
            <span>{{ selectedFlight.inboundDate | dayname }}</span> <span>{{ selectedTicket.inBoundDepartureTime | hoursMins }}</span> - <span>{{ selectedTicket.inBoundArrivalTime | hoursMins }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TicketInfo',
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
