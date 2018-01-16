<template>
	<div class="component-footer has-text-centered">
		<div class="section">
			<div class="container">
				<p class="changelog">
					Recent changes:<br>
					<ul>
						<li>Dec 28th: Boards with equal threads/hour no longer wildly move around on updates.</li>
						<li>Dec 26th: All non-NSFW-ish boards now enabled by default. Removed confusing preset buttons.</li>
						<li>Dec 22nd: Fixed thumbnails not showing on Edge (and maybe Safari?)</li>
						<li>Dec 21st: Changed timeline selection to daily / hourly (1 week / 4 weeks)</li>
						<li>Dec 17th: Corrected post count for boards that skip post ID dubs. (/v/, /vg/, /vr/)</li>
					</ul>
				</p>
				<br>
				<p>
					The information above is gathered from the 4chan API.
					<br> Visit
					<a href="https://4chan.org" target="_blank" rel="noopener">4chan.org</a> to view all boards & threads or check out the
					<a href="https://github.com/4chan/4chan-API" target="_blank" rel="noopener">API documentation</a>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
}
</script>

<style scoped lang="scss">
@import "~css/variables.scss";

textarea {
	color: black;
}

* {
	color: #f1f1f1;
}

.component-footer>.section {
	background: transparent;
}

p {
	font-size: 0.875rem;
}

a {
	color: $nord14;
}

.changelog{

}

.tfw-nocoiner{
	display: none;
	font-size: 0.5rem;
}
</style>