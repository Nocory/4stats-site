<template>
	<div class="component-feedback" v-once>
		<div class="container">
			<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSewTqwFoSGR40rhSsLshM9mBbi3jfLdijYXjs9dksvnpEM0wQ/viewform?embedded=true" width="640" height="530" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>
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
				<div class="qa-card__question">seeing historical spikes for certain boards is super interesting, but what would be even better is to have a small tag with the reason why it happened that links to some threads for example for the 2016 elections have the spike tagged at the top "election results" and some of the threads of that night</div>
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
import axios from "axios"
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