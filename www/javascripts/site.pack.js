// This is a main JavaScript file that will ll be compiled into /javascripts/site.js
//
// Any JavaScript file in your site folder can be referenced here by using import or require statements.
// Additionally, you can import modules installed via your package.json file.
//
// For example:
// import './fileName'
//
// To learn more, visit https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import

import './dates'
var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
document.querySelector('html').classList.add(supportsTouch ? 'touch' : 'no-touch')
const visiters = document.querySelectorAll('.visit-trigger');
visiters.forEach(node => {
  if(node.pathname != window.location.pathname){
    const url = node.href;
    const delayVisit = (evt) => {
      node.parentNode.classList.add('clicked')
      evt.preventDefault();
      document.body.classList.add('out');
      
      const fadeUps = document.querySelectorAll('.fade-up');
      let fadedUp = 0;
      fadeUps.forEach(elem => {
        elem.addEventListener('animationend', () => {
          if (++fadedUp == fadeUps.length){
            setTimeout(() => window.location = url, 50)
          }
        })
      })
    }
    node.addEventListener('click', delayVisit)
    node.addEventListener('touchstart', delayVisit)
  }
})