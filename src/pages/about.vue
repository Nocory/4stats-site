<template>
	<div class="component-about" v-once>
		<div class="explanation">
			<h3>Boardstats:</h3>
			<p>
				Every few seconds the server checks the catalog of a different board and recalculates its long-term stats.<br />
				One full cycle of all 72 boards is set to take 5 minutes.<br />
				Slower boards don't have their current activity level displayed, since the value would be too volatile.<br />
				<br />
				'Activity Now' is the boards current activity level, relative to its own average daily peak (95th percentile of posts/minute).<br />
				'rel. to ToD' (relative to time of day) is the boards current activity level, relative to what's usually seen this time of day and day of the week.
			</p>
			<hr />
			<h3>Threadlist:</h3>
			<p>
				Lists the boards 8 most active threads. (stickies always get sorted to the top)<br />
				Each threads posts/minute are of its total lifetime.<br />
				Don't directly compare this to a boards posts/minute, which are calculated from the last 30 minutes.
			</p>
			<hr />
			<h3>Chart:</h3>
			<p>
				I initially started checking stats mid-2017 for most SFW boards and end-2017 for most NSFW boards.<br />
				For most boards the timeline only goes back to that point.<br />
				A friendly admin from <a href="https://rbt.asia">rbt.asia</a> and <a href="https://desuarchive.org">desuarchive.org</a> offered to help out and provided data to reconstruct an earlier timeline for those boards they cover.<br />
				Some other data for /pol/, /tv/, /sp/ and /x/ was taken from <a href="https://4plebs.org/">4plebs.org</a><br />
				<br />
				'Cycle' values are the data points the backend generates from each catalog check. These are used to calculate long term stats, as well as further hourly and daily data points for the chart.<br />
				'Activity' is equivalent to the boardslist 'Activity Now' category.
			</p>
			<hr />
			<h3>Post-Analysis:</h3>
			<p>
				to be filled in
			</p>
		</div>
	</div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.component-about {
	@include desktop {
		padding: 1rem;
	}

	@include widescreen {
		padding: 1rem 2rem 2rem;
	}
}

.explanation {
	display: flex;
	flex-direction: column;
	margin-bottom: 1rem;
	padding: 0.5rem;
	font-size: 0.8em;
	max-width: 1024px;
	background-color: var(--background-content-2n);
	@include desktop {
		@include float-shadow-box;
	}
	> h3 {
		color: var(--color-text);
		margin: 0.5rem 0;
	}
	> p {
		color: var(--color-text-faded);
		margin: 0;
	}
}

a {
	text-decoration: underline;
}

hr {
	width: 100%;
	color: var(--color-text);
	opacity: 0.25;
}
</style>