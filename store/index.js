import Vuex from 'vuex'
import axios from 'axios'
// import Cookie from 'js-cookie'

function sortByShortname (a, b) {
  const flightA = a.shortName.toUpperCase()
  const flightB = b.shortName.toUpperCase()

  let comparison = 0
  if (flightA > flightB) {
    comparison = 1
  } else if (flightA < flightB) {
    comparison = -1
  }
  return comparison
}

const createStore = () => {
  return new Vuex.Store({
    state: {
      flightList: [],
      selectedFlight: {},
      departureStation: {},
      arrivalStation: {},
      selectedConnections: [],
      availableTickets: [],
      availableReturnTickets: [],
      loadingTickets: false,
      loadingReturnTickets: false,
      returnSelected: false
    },
    mutations: {
      setFlights (state, payload) {
        payload.forEach((flight) => {
          flight.connections.some((connection) => {
            if (connection.iata != null) {
              state.flightList.push(flight)
              return connection.iata != null
            }
          })
        })
      },
      selectedConnections (state, payload) {
        state.selectedConnections = []
        payload.forEach((connection) => {
          this.getters.flightList.forEach((flight) => {
            if (flight.iata === connection.iata) {
              state.selectedConnections.push({ ...connection, shortName: flight.shortName })
            }
          })
        })
        state.loadingTickets = true
        state.loadingReturnTickets = true
      },
      availableTickets (state, payload) {
        state.availableTickets = payload
        state.loadingTickets = false
      },
      availableReturnTickets (state, payload) {
        state.availableReturnTickets = payload
        state.loadingReturnTickets = false
      },
      setFlightInfo (state, payload) {
        state.selectedFlight = payload
      },
      arrivalStation (state, payload) {
        state.arrivalStation = payload
      },
      departureStation (state, payload) {
        state.departureStation = payload
      },
      clearTickets (state) {
        state.availableTickets = []
        state.availableReturnTickets = []
      },
      returnSelected (state, payload) {
        state.returnSelected = payload
      }
    },
    getters: {
      flightList (state) {
        return state.flightList.sort(sortByShortname)
      },
      selectedConnections (state) {
        return state.selectedConnections.sort(sortByShortname)
      },
      availableTickets (state) {
        return state.availableTickets
      },
      availableReturnTickets (state) {
        return state.availableReturnTickets
      },
      selectedFlight (state) {
        return state.selectedFlight
      },
      arrivalStation (state) {
        return state.arrivalStation
      },
      departureStation (state) {
        return state.departureStation
      },
      loadingTickets (state) {
        return state.loadingTickets
      },
      loadingReturnTickets (state) {
        return state.loadingReturnTickets
      },
      returnSelected (state) {
        return state.returnSelected
      }
    },
    actions: {
      nuxtServerInit (context, vuecontext) {
        return axios.get('https://mock-air.herokuapp.com/asset/stations')
          .then((response) => {
            context.commit('setFlights', response.data)
          })
          .catch(e => vuecontext.error(e))
      },
      setConnections (context, payload) {
        let selectedConnections
        context.getters.flightList.forEach((flight) => {
          if (flight.iata === payload.iata) {
            selectedConnections = flight.connections
          }
        })
        context.commit('selectedConnections', selectedConnections)
      },
      availableTickets (context, payload) {
        context.commit('clearTickets')
        return axios.get('https://mock-air.herokuapp.com/search?departureStation=' + payload.departureStation.iata + '&arrivalStation=' + payload.arrivalStation.iata + '&date=' + payload.outboundDate)
          .then((response) => {
            context.commit('availableTickets', response.data)
            context.commit('setFlightInfo', payload)
            context.commit('arrivalStation', payload.arrivalStation)
            context.commit('departureStation', payload.departureStation)
          })
          .catch(e => context.error(e))
      },
      availableReturnTickets (context, payload) {
        return axios.get('https://mock-air.herokuapp.com/search?departureStation=' + payload.arrivalStation.iata + '&arrivalStation=' + payload.departureStation.iata + '&date=' + payload.inboundDate)
          .then((response) => {
            context.commit('availableReturnTickets', response.data)
          })
          .catch(e => context.error(e))
      },
      returnSelected (context, payload) {
        if (payload) {
          context.commit('returnSelected', true)
        } else {
          context.commit('returnSelected', false)
        }
      }

    }
  })
}

export default createStore
