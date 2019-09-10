<template>
  <div v-once class="component-feedback">
    <div class="container">
      <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSewTqwFoSGR40rhSsLshM9mBbi3jfLdijYXjs9dksvnpEM0wQ/viewform?embedded=true" width="640" height="530" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>
      <div class="qa-card">
        <div class="qa-card__time">Sep 10, 2019</div>
        <div class="qa-card__question">
          Idea: Like the flag analysis - A word analysis by board from posts collected during a certain period (January to July 2019?). Should include: Word count by board, word frequency by board (relative and total), ability to plot word frequencies in two (if possible, three) dimensions, ability to type in a word and get relative and total word frequency by board<br />
          <br />
          e.g. Search "newfag" and /b/ might be #1 with about 1 million uses, against a total of 500 million words mentioned on /b/, for a relative frequency of 0.02%.<br />
          <br />
          I could use it to make PCA graphs to "group" boards by keywords.
        </div>
        <div class="qa-card__answer">
          I would love to do that, but I have so little time right now.<br />
          I really would like to get the board-snapshotter running again (it's basically like a mini-archiver), before the end of the year, when I make another stats-thread.<br />
          So until then, I plan on rewriting and putting it up again, so I have at least 1 month of fresh data at the end of the year
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card__time">Sep 1, 2019</div>
        <div class="qa-card__question">
          Use hash of images on 4chan and see most frequently posted images uploaded to their particular boards over a month's time? Now that would be interesting to see.
        </div>
        <div class="qa-card__answer">
          That's not possible, since the stats are calculated from the catalog and not by fetching all threads with all their posts and images individually.
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card__time">Aug 27, 2019</div>
        <div class="qa-card__question">
          Hey anon, why don't sticky threads show a post rate?
        </div>
        <div class="qa-card__answer">
          Since stickies are usually rolling and capped at 1000, the general method of (posts / (current_time - thread_creation_time)) doesn't work here.<br />
          I'd have to add a special case, where it gets the time from the first reply instead of the OP, when replies are >= 1k.<br />
          Not difficult, but it wasn't a priority so far and I still want to rewrite the stats-gatherer in the near future anyway if possible, where I would then also do this change.<br />
          (if I actually find the time)
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card__time">Aug 21, 2019</div>
        <div class="qa-card__question">
          Any way I could make tiers for boards, so things I browse ranked on the left and the rest on the right for instance?
        </div>
        <div class="qa-card__answer">
          There used to be a config page, but its use was really limited so I removed it. Among other things it had the option to show/hide specific boards.<br />
          <br />
          Segmenting the list according to custom categories wouldn't be hard to implement, but I don't think it's a feature that many others would use.<br />
          It would also be necessary to re-add some kind of settings page.<br />
          <br />
          I'll think about it again, but imo it's probably better to keep it simple.
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card__time">Jun 17, 2019</div>
        <div class="qa-card__question">
          Ideas:<br />
          Sentiment analysis (by thread and/or by board)
        </div>
        <div class="qa-card__answer">
          Not really possible since I only fetch the catalog and see the OPs, not whole threads.<br />
          Even then it's kind of tricky, since the text of posts isn't formatted in any kind of normal way like some blog post or news article.
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card__time">Jun 10, 2019</div>
        <div class="qa-card__question">
          Shit's broke, man. Websocket won't connect.
        </div>
        <div class="qa-card__answer">
          A network switch for the server node that the API is located on failed and is currently being replaced.<br />
          The stats-gatherer has its own server and will continue checking the boards, but the data won't get forwarded to clients until this gets fixed.<br />
          Not much to do but wait.
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card__time">May 27, 2019</div>
        <div class="qa-card__question">
          Any chance we can get a breakdown of what country flags are posting most often on /pol/ & /int/ ?
        </div>
        <div class="qa-card__answer">
          Yeah, I have data for /pol/ and /int/ posts from the beginning of the year till now.<br />
          I first need to do some overhaul of the script that gathers the data for the 'Post-Analysis' page though.<br />
          <br />
          At the beginning of the year I planned to let it only run for a week or so, but now it has been collecting posts for almost 5 months and the small VPS it's running on is almost full, so that has to be taken care of.<br />
          If I find the time I will put that info up on the site during the next week or two.
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card__time">May 18, 2019</div>
        <div class="qa-card__question">
          what's the monthly cost to run this website?
        </div>
        <div class="qa-card__answer">
          It's ~13 $ for 2 small VPS.<br />
          One for the Stats-Gatherer that fetches data from 4chan and one for the API, that sends data to the browser clients.<br />
          <br />
          I always kept them separate, just so that issues with the public facing API server won't have the possibility to interrupt the stats gathering. Though in the past there has never been a problem and I might merge the two into a single VPS.<br />
          <br />
          The .io domain is ~35 $ per year, so the total comes to ~192 $ per year right now.<br />
          121 $ if I merge the 2 servers.
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card__time">Mar 27, 2019</div>
        <div class="qa-card__question">
          <span class="greentext">&gt;Something like that would take quite some time to create and also to maintain.</span>
          <br />you could just have it pull the name of the most active/pinned thread and put it as a marker past a certain activity point (500%?)
        </div>
        <div class="qa-card__answer">
          Many spikes may be due to activity over a longer period, like the yearly April fools events, some lengthy US Senate stream (Kavanaugh), Spectre/Meltdown news on /g/.
          <br />If you automatically grab a popular thread during that time, you probably need to go back and correct things anyway, to keep the entries relevant and not end up with a bunch of "ITS HAPPENING!!!" threads. <br />Specifiying entries manually would be the better option, but still, don't think I have the time for that right now and "chartjs-plugin-annotation" doesn't look like it would work out of the box for this either.
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card__time">Feb 2, 2019</div>
        <div class="qa-card__question">
          seeing historical spikes for certain boards is super interesting, but what would be even better is to have a small tag with the reason why it happened that links to some threads for example for the 2016 elections have the spike tagged at the top "election results" and some of the threads of that night
        </div>
        <div class="qa-card__answer">
          Something like that would take quite some time to create and also to maintain.
          <br />Most of the larger spikes are from well known events anyway (Elections, E3, world cup, April 1st, etc.) <br />For smaller activity jumps you would have to decide what the cutoff is and then the tagging becomes a bit arbitrary anyways. <br />I think it makes more sense to simply look up the day in some wiki or archive, if someone is really curious.
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card__time">Jan 24, 2019</div>
        <div class="qa-card__question">
          Have you ever thought of implementing some kind of measure of "interestingness" of a thread?
          <br />Something like Reply Length vs Reply Rate, or maybe Number of Replies based on certain keywords? <br />Also, it can be useful to add a feature to look for certain thread title keywords, such as "general" or "storytime"...
        </div>
        <div class="qa-card__answer">
          I wouldn't really want to set up a system to rate or curate threads in such a way, that goes much beyond just showing the ones contributing the most to a boards current activity, as it is now.
          <br />
          <br />For the threadlist on the main page it's not even technically possible, as it only has the data from the catalog (OP + 5 most recent replies) to generate the stats.
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card__time">Nov 2, 2018</div>
        <div class="qa-card__question">can you post the code for the website on github in case you can't fund it</div>
        <div class="qa-card__answer">
          Scroll all the way down.
          <br />On the bottom of each page are links to the relevant repositories.
          <br />
          <br />Current yearly cost is ~200$, though if I wanted I could cut the cost down by half, by combining the Gatherer and API server and using a cheaper TLD.
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card__time">Jul 18, 2018</div>
        <div class="qa-card__question">Why doesn't /adv/ preview OP images?</div>
        <div class="qa-card__answer">
          Adblockers prevent them from loading because of the ".org/adv/" in "https://i.4cdn.org/adv/1531810755359s.jpg".
          <br />Not sure what to do about it really.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.component-feedback {
  position: relative;
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @include touch {
    padding: 1rem;
  }

  @include desktop {
    padding: 2rem 2rem 2rem;
  }
}

.container {
  position: relative;
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

iframe {
  max-width: 100%;
}

.qa-card {
  position: relative;

  width: 640px;
  max-width: 100%;

  margin: 0.5rem 0;
  padding: 1rem;
  //
  background: $oc-gray-0;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  line-height: 1.2;
  @include float-shadow-box;

  &__time {
    color: $oc-gray-6;
    font-size: 0.875rem;
  }

  &__question {
    position: relative;
    color: $oc-gray-7;
    font-weight: bolder;
    margin-bottom: 1rem;
    &::after {
      content: "";
      position: absolute;
      left: 0rem;
      bottom: -0.5rem;
      height: 2px;
      width: 4rem;
      background: $oc-blue-8;
    }
  }
  &__answer {
    color: $oc-gray-7;
  }
}

.greentext {
  background: $oc-gray-8;
}
</style>
