import Vue from 'vue'
import moment from 'moment'

const hoursMins = (date) => {
  return moment(date).format('HH:mm')
}

const day = (date) => {
  return moment(date).format('DD')
}

const month = (date) => {
  return moment(date).format('MMM')
}

const dayname = (date) => {
  return moment(date).format('ddd')
}

const longDate = (date) => {
  return moment(date).format('dddd, Do MMMM YYYY')
}

Vue.filter('hoursMins', hoursMins)
Vue.filter('day', day)
Vue.filter('month', month)
Vue.filter('dayname', dayname)
Vue.filter('longDate', longDate)
