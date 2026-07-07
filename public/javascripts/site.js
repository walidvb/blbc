var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
document.querySelector('html').classList.add(supportsTouch ? 'touch' : 'no-touch')
const visiters = document.querySelectorAll('.visit-trigger');
visiters.forEach(node => {
  if (node.pathname != window.location.pathname) {
    return
    const url = node.href
    const delayVisit = (evt) => {
      node.parentNode.classList.add('clicked')
      evt.preventDefault()
      document.body.classList.add('out')

      const fadeUps = document.querySelectorAll('.fade-up')
      let fadedUp = 0
      fadeUps.forEach((elem) => {
        elem.addEventListener('animationend', () => {
          if (++fadedUp == fadeUps.length) {
            setTimeout(() => (window.location = url), 50)
          }
        })
      })
    }
    node.addEventListener('click', delayVisit)
  }
})
console.log("Site by walidvb.com 💥");
