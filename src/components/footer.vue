<template>
	<div class="component-footer" v-once>
		<div class="container is-fluid">
			<p>
				Data source: <a href="https://4chan.org" target="_blank" rel="noopener">https://4chan.org</a>.<br />
				The information above is gathered via the <a href="https://github.com/4chan/4chan-API" target="_blank" rel="noopener">4chan API</a>.
			</p>
			<p>
				This project on Github:
				<a href="https://github.com/Nocory/4stats-gatherer" target="_blank" rel="noopener">Stats-Gatherer</a> /
				<a href="https://github.com/Nocory/4stats-api" target="_blank" rel="noopener">API-Server</a> /
				<a href="https://github.com/Nocory/4stats-site" target="_blank" rel="noopener">Website</a>
			</p>
		</div>
	</div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.component-footer {
	position: relative;
	background: var(--background-nav);
	z-index: 10;
	padding: 1rem;
	@include desktop {
		@include float-shadow-box;
	}
}

.container {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	height: 100%;
	width: $fullhd;
	max-width: calc(100% - 64px);
	margin: auto;
}

p {
	font-size: 0.875rem;
	color: var(--color-text-faded2);
	margin: 0;
}

a {
	text-decoration: underline;
}
</style>