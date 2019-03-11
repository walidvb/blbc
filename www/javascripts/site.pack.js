// This is a main JavaScript file that will ll be compiled into /javascripts/site.js
//
// Any JavaScript file in your site folder can be referenced here by using import or require statements.
// Additionally, you can import modules installed via your package.json file.
//
// For example:
// import './fileName'
//
// To learn more, visit https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import

const visiters = document.querySelectorAll('.visit-trigger');
visiters.forEach(node => {
  if(node.pathname != window.location.pathname){
    const url = node.href;
    const delayVisit = (evt) => {
    evt.preventDefault();
    document.body.classList.add('out');

    const photo = node.parentNode.querySelectorAll('.photo')[0];
    // if is a name anchor
    if(photo){
      node.parentNode.classList.add('clicked')
      photo.addEventListener('animationend', () => {
        setTimeout(()=>window.location = url, 50)
      })
    }
    else{
      const main = document.querySelectorAll('.fade-up')[0];
      main.addEventListener('animationend', () => {
        setTimeout(() => window.location = url, 50)
      })
    }
  }
    node.addEventListener('click', delayVisit)
  }
})