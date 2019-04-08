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
    weekday: 'long'
  }
  const formatDate = (date) => {
    const dd = new Date(date)
    const day = dd.toLocaleDateString('en-UK', dateOptions)
    return `${day}, ${dd.getDate()}.${dd.getMonth()+1}.${dd.getFullYear()}`
  }
  const entryAsHtml = (item) => `
    <div class="gig">
      <div class="gig-date">${formatDate(item['ev:startdate'])}</div>
      <div class="gig-name"><a href="${item['link']}" target="_blank">${item['ev:name']}</a></div>
      <div class="gig-location">${item['ev:location']}, ${item['ev:country']}</div>
    </div>
  `
  parser.parseURL(rssLink, options, (err, parsed) => {
    const entries = parsed.feed.entries
    const calendar = entries.map(entryAsHtml)
    rssContainer.innerHTML = calendar.join('')
    console.log(entries[0])
  })

  fetch(rssLink).then(r => r.text()).then(console.log)
}