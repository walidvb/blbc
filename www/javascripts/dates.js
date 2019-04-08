const parser = require('rss-parser-browser');
const options = {
  customFields: {
    item: ['ev:startdate', 'ev:location', 'ev:country', 'ev:name']
  }
}

const rssContainer = document.querySelector('[data-rss]')
if(rssContainer){
  const rssLink = rssContainer.attributes['data-rss'].value
  const dateOptions = {
    weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'

  }
  const entryAsHtml = (item) => `
    <div class="gig">
      <div class="gig-date">${new Date(item['ev:startdate']).toLocaleDateString('en-US', dateOptions)}</div>
      <div class="gig-name">${item['ev:name']}</div>
      <div class="gig-location">${item['ev:location']}, ${item['ev:country']}</div>
    </div>
  `
  parser.parseURL(rssLink, options, (err, parsed) => {
    const entries = parsed.feed.entries
    const calendar = entries.map(entryAsHtml)
    rssContainer.innerHTML = calendar
    console.log(entries[0])
  })

  fetch(rssLink).then(r => r.text()).then(console.log)
}