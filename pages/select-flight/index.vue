<template>
  <div>
    <div class="page-header">
      <nuxt-link to="/">
        <img class="logo" src="/images/logo.svg">
      </nuxt-link>
      <div class="page-header__info">
        <div class="page-header__departure">
          <div class="page-header__departure__text">
            Leaving from
          </div>
          <div>
            {{ departureStation.shortName }}
          </div>
        </div>
        <div class="page-header__arrows">
          <img class="page-header__arrows__right-arrow" src="/images/arrowWhite.svg">
          <img v-if="selectedFlight.inboundDate" class="page-header__arrows__left-arrow" src="/images/arrowWhite.svg">
        </div>
        <div class="page-header__arrival">
          <div>
            {{ arrivalStation.shortName }}
          </div>
        </div>
      </div>
    </div>
    <div class="select-flight-container">
      <div class="page-title">
        <img class="page-title__plane-icon" src="/images/plane.svg">
        <h1>Select flight</h1>
      </div>
      <aside>
        <div class="ticket-summary">
          <div class="ticket-summary__header">
            <span>Flights</span><span class="ticket-summary__header__price">${{ totalPrice }}</span>
          </div>
          <div class="ticket-summary__body">
            <div v-if="!ticketIsSelected">
              <p style="padding:15px">
                Choose an outbound flight
              </p>
            </div>
            <div v-else>
              <TicketInfo :selected-flight="selectedFlight" :selected-ticket="selectedTicket" />
            </div>
          </div>
          <div class="ticket-summary__footer">
            <span>Total</span><span class="ticket-summary__footer__price">${{ totalPrice }}</span>
          </div>
        </div>
        <button class="btn btn-pay" :disabled="!ticketIsSelected" @click="summary = true">
          Pay now
        </button>
      </aside>
      <div>
        <div class="tickets-table__wrapper">
          <div class="tickets-table__header">
            <h2>Outbound</h2>
            <span class="tickets-table__header__station">{{ departureStation.shortName }}</span>
            <img src="/images/arrow.svg">
            <span class="tickets-table__header__station">{{ arrivalStation.shortName }}</span>
          </div>
          <div class="tickets-table__date">
            {{ selectedFlight.outboundDate | longDate }}
          </div>
          <div v-if="!loadingTickets">
            <div v-if="availableTickets.length > 0" class="tickets-table">
              <div class="table-row__ticket-level">
                <div />
                <div class="tickets">
                  <div class="ticket">
                    Basic
                  </div>
                  <div class="ticket">
                    Normal
                  </div>
                  <div class="ticket">
                    Plus
                  </div>
                </div>
              </div>
              <div v-for="availableTicket in availableTickets" :key="availableTicket.flightNumber">
                <div v-if="availableTicket.remainingTickets > 0" class="table-row">
                  <div class="flight-time">
                    {{ availableTicket.departure | hoursMins }} <img src="/images/shortArrow.svg"> {{ availableTicket.arrival | hoursMins }}
                  </div>
                  <div class="tickets">
                    <div v-for="availableFare in availableTicket.fares" :key="availableFare.fareSellKey" class="ticket">
                      <Ticket :id="availableFare.fareSellKey" v-model="availableFare.price" name="outBoundPrice" @change="setOutboundTicket(availableTicket, availableFare)">
                        ${{ availableFare.price }}
                      </Ticket>
                      <label :for="availableFare.fareSellKey">${{ availableFare.price }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else style="padding: 20px;">
              <p class="text-center">
                Sorry, no flights on this day!
              </p>
            </div>
          </div>
          <div v-else style="padding: 20px;">
            <p class="text-center">
              Loading...
            </p>
          </div>
        </div>
        <div class="tickets-table__wrapper">
          <div class="tickets-table__header">
            <h2>Inbound</h2>
            <span class="tickets-table__header__station">{{ arrivalStation.shortName }}</span>
            <img src="/images/arrow.svg">
            <span class="tickets-table__header__station">{{ departureStation.shortName }}</span>
          </div>
          <div v-if="returnSelected">
            <div v-if="!loadingReturnTickets">
              <div v-if="availableReturnTickets.length > 0">
                <div class="tickets-table__date">
                  {{ selectedFlight.inboundDate | longDate }}
                </div>
                <div class="tickets-table">
                  <div v-for="availableTicket in availableReturnTickets" :key="availableTicket.flightNumber">
                    <div v-if="availableTicket.remainingTickets > 0" class="table-row">
                      <div class="flight-time">
                        {{ availableTicket.departure | hoursMins }} <img src="/images/shortArrow.svg"> {{ availableTicket.arrival | hoursMins }}
                      </div>
                      <div class="tickets">
                        <div v-for="availableFare in availableTicket.fares" :key="availableFare.fareSellKey" class="ticket">
                          <Ticket :id="availableFare.fareSellKey" v-model="availableFare.price" name="inBoundPrice" @change="setInboundTicket(availableTicket, availableFare)">
                            ${{ availableFare.price }}
                          </Ticket>
                          <label :for="availableFare.fareSellKey">${{ availableFare.price }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else style="padding: 20px;">
                <p class="text-center">
                  Sorry, no flights on this day!
                </p>
              </div>
            </div>
            <div v-else style="padding: 20px;">
              <p class="text-center">
                Loading...
              </p>
            </div>
          </div>

          <div v-else>
            <form @submit.prevent="submitForm">
              <div class="return-form">
                <div class="text-center">
                  <client-only>
                    <date-picker v-model="selectedFlight.inboundDate" input-class="form-control" placeholder="Return" :format="customFormatter" :disabled-dates="disabledDatesArrival" />
                  </client-only>
                </div>
                <div class="text-center">
                  <button class="btn btn-search">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="summary" class="ticket-modal__wrapper">
      <div class="ticket-modal">
        <div class="ticket-modal__header">
          Thanks for buying your tickets at mito airlines
        </div>
        <div class="ticket-modal__body">
          <TicketInfo :selected-flight="selectedFlight" :selected-ticket="selectedTicket" />
        </div>
        <div class="ticket-modal__footer">
          Total: <span class="ticket-modal__footer__price"> ${{ totalPrice }}</span><span class="ticket-modal__footer__reset" @click="reset">No, thanks (reset)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Ticket from '@/components/Ticket'
import TicketInfo from '@/components/TicketInfo'
export default {
  components: {
    Ticket,
    TicketInfo
  },
  data () {
    return {
      selectedTicket: {
        outBoundPrice: null,
        outBoundDepartureTime: '',
        outBoundArrivalTime: '',
        inBoundPrice: null,
        inBoundDepartureTime: '',
        inBoundArrivalTime: ''
      },
      summary: false
    }
  },
  computed: {
    availableTickets () {
      return this.$store.getters.availableTickets
    },
    availableReturnTickets () {
      return this.$store.getters.availableReturnTickets
    },
    selectedFlight () {
      return this.$store.getters.selectedFlight
    },

    arrivalStation () {
      return this.$store.getters.arrivalStation
    },
    departureStation () {
      return this.$store.getters.departureStation
    },
    totalPrice () {
      return this.selectedTicket.outBoundPrice + this.selectedTicket.inBoundPrice
    },
    ticketIsSelected () {
      return this.selectedTicket.outBoundPrice != null || this.selectedTicket.inBoundPrice != null
    },
    disabledDatesArrival () {
      return {
        to: new Date(this.$moment(this.selectedFlight.outboundDate))
      }
    },
    loadingTickets () {
      if (this.$store.getters.loadingTickets === false) {
        return false
      } else {
        return true
      }
    },
    loadingReturnTickets () {
      if (this.$store.getters.loadingReturnTickets === false) {
        return false
      } else {
        return true
      }
    },
    returnSelected () {
      return this.$store.getters.returnSelected
    }

  },
  methods: {
    setOutboundTicket (availableTicket, ticket) {
      this.selectedTicket.outBoundPrice = ticket.price
      this.selectedTicket.outBoundDepartureTime = availableTicket.departure
      this.selectedTicket.outBoundArrivalTime = availableTicket.arrival
    },
    setInboundTicket (availableTicket, ticket) {
      this.selectedTicket.inBoundPrice = ticket.price
      this.selectedTicket.inBoundDepartureTime = availableTicket.departure
      this.selectedTicket.inBoundArrivalTime = availableTicket.arrival
    },
    customFormatter (date) {
      return this.$moment(date).format('YYYY-MM-DD')
    },
    submitForm () {
      if (this.selectedFlight.inboundDate) {
        this.$store.dispatch('returnSelected', true)
        this.$store.dispatch('availableReturnTickets', this.selectedFlight)
      }
    },
    reset () {
      Object.keys(this.selectedTicket).forEach((key) => {
        this.selectedTicket[key] = null
      })
      const inBoundTickets = document.getElementsByName('inBoundPrice')
      inBoundTickets.forEach((ticket) => {
        ticket.checked = false
      })
      const outBoundTickets = document.getElementsByName('outBoundPrice')
      outBoundTickets.forEach((ticket) => {
        ticket.checked = false
      })
      this.summary = false
    }
  }
}
</script>
