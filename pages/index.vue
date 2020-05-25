<template>
  <div class="home-form">
    <div class="page-header">
      <img class="logo" src="/images/logo.svg">
      <h1>
        Mito airlines
      </h1>
    </div>
    <div class="home-form__body">
      <form @submit.prevent="submitForm">
        <div class="input-container">
          <div>
            <multiselect
              v-model="selectedFlight.departureStation"
              track-by="iata"
              label="shortName"
              placeholder="Origin"
              :options="flightList"
              :searchable="true"
              :allow-empty="false"
              :class="{errorBorder:errors.departureStation}"
              @input="selectConnection"
            >
              <template slot-scope="{ option }">
                {{ option.shortName }}
              </template>
            </multiselect>
            <p v-if="errors.departureStation" class="input-error">
              Please select origin!
            </p>
          </div>
          <div>
            <multiselect
              v-model="selectedFlight.arrivalStation"
              track-by="iata"
              label="shortName"
              placeholder="Destination"
              :options="selectedConnections"
              :searchable="true"
              :class="{errorBorder:errors.arrivalStation}"
              :allow-empty="false"
              @input="selectReturn"
            >
              <template slot-scope="{ option }">
                {{ option.shortName }}
              </template>
            </multiselect>
            <p v-if="errors.arrivalStation" class="input-error">
              Please select destination!
            </p>
          </div>
          <div>
            <client-only>
              <date-picker
                v-model="selectedFlight.outboundDate"
                :input-class="['form-control', {errorBorder:errors.outboundDate}]"
                placeholder="Departure"
                :format="customFormatter"
                :disabled-dates="disabledDatesDeparture"
                @input="selectoutboundDate"
              />
            </client-only>
            <p v-if="errors.outboundDate" class="input-error">
              Please select departure!
            </p>
          </div>
          <div>
            <client-only>
              <date-picker v-model="selectedFlight.inboundDate" input-class="form-control" placeholder="Return" :format="customFormatter" :disabled-dates="disabledDatesArrival" />
            </client-only>
          </div>
        </div>
        <div class="text-center">
          <button class="btn btn-search">
            Search
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  components: {
    Multiselect
  },
  data () {
    return {
      selectedFlight: {
        departureStation: null,
        arrivalStation: null,
        outboundDate: null,
        inboundDate: null
      },
      errors: {
        departureStation: false,
        arrivalStation: false,
        outboundDate: false,
        inboundDate: false
      },
      formValid: false
    }
  },
  computed: {
    flightList () {
      return this.$store.getters.flightList
    },
    selectedConnections () {
      return this.$store.getters.selectedConnections
    },
    disabledDatesArrival () {
      return {
        to: new Date(this.$moment(this.selectedFlight.outboundDate))
      }
    },
    disabledDatesDeparture () {
      return {
        to: new Date(this.$moment(Date.now()).subtract(1, 'days'))
      }
    }
  },
  methods: {
    selectConnection () {
      this.errors.departureStation = false
      this.selectedFlight.arrivalStation = null
      this.$store.dispatch('setConnections', this.selectedFlight.departureStation)
    },
    selectReturn () {
      this.errors.arrivalStation = false
    },
    selectoutboundDate () {
      this.errors.outboundDate = false
      this.selectedFlight.inboundDate = null
    },
    customFormatter (date) {
      return this.$moment(date).format('YYYY-MM-DD')
    },
    submitForm () {
      this.validate()
      if (this.formValid) {
        this.$store.dispatch('availableTickets', this.selectedFlight)
        if (this.selectedFlight.inboundDate) {
          this.$store.dispatch('availableReturnTickets', this.selectedFlight)
        }
        this.$router.push('select-flight')
      }
    },
    validate () {
      Object.keys(this.selectedFlight).forEach((key) => {
        if (this.selectedFlight[key] == null) {
          this.errors[key] = true
        } else {
          this.errors[key] = false
        }
      })
      this.errors.inboundDate = false // not required
      Object.keys(this.errors).some((key) => {
        if (this.errors[key] === true) {
          this.formValid = false
          return this.errors[key] === true
        } else {
          this.formValid = true
        }
      })
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>

</style>
