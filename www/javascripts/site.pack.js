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
console.log(visiters);
visiters.forEach(node => {
  const url = node.attributes.href.value;
  const delayVisit = (evt) => {
    evt.preventDefault();
    document.body.classList.add('out');

    const photo = node.parentNode.querySelectorAll('.photo')[0];
    // if is a name anchor
    if(photo){
      node.parentNode.classList.add('clicked')
      photo.addEventListener('animationend', () => {
        window.location = url
      })
    }
    else{
      const main = document.querySelectorAll('.fade-up')[0];
      main.addEventListener('animationend', () => {
        window.location = url
      })
    }
  }
  node.addEventListener('click', delayVisit)
})