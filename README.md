# 4stats-site

The [**4stats website**](https://4stats.io) displays live statistics of 4chan boards and most active threads, as well as past activity.

With some exceptions most SFW-*ish* boards had their history recorded since the end of July 2017. NSFW-*ish* boards were added later and have been recorded since the end of october.

---
## Main Libraries:

The site mainly uses [**Vue.js**](https://vuejs.org/) to render updating stats and threads.

[**Chart.js**](http://www.chartjs.org/) is utilized to display the recorded post- & activity-history.

For styling the site, parts of [**Bulma CSS**](https://bulma.io/) are used. (Primarily the grid system and layout containers).

Color schemes in use are [**Nord**](https://arcticicestudio.github.io/nord/) and [**open-color**](https://yeun.github.io/open-color/).

Bundled together with [**Webpack**](https://webpack.js.org/) and hosted on [**Netlify**](https://www.netlify.com/).

---
## Client-Server Communication

The site establishes a socket connection to the [**4stats API**](https://github.com/nocory/4stats-api) server.

Board-statistics are streamed via the socket, while thread and timelinedata is requested from the REST API.

---
Older non-evergreen browser are intentionally not supported.