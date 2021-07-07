/*
*
* helper functions from vue-debounce library
* https://github.com/dhershman1/vue-debounce/blob/0963380a55760a457450bec7128adc30b1849584/src/debounce.js
*
* License - MIT:
* https://github.com/dhershman1/vue-debounce/blob/0963380a55760a457450bec7128adc30b1849584/LICENSE
*
*/
function convertTime (time) {
  const [amt, t = 'ms'] = String(time).split(/(ms|s)/i)
  const types = {
    ms: 1,
    s: 1000
  }

  return Number(amt) * types[t]
}

export function debounce (fn, wait) {
  let timeout = null
  const timer = typeof wait === 'number' ? wait : convertTime(wait)

  const debounced = function (...args) {
    const later = () => {
      timeout = null

      fn.apply(this, args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, timer)

    if (!timeout) {
      fn.apply(this, args)
    }
  }

  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}
/*
* vue-debounce end
*/
