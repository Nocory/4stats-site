<template>
	<div class="meta-component" v-once>
		<div class="component-title">Info</div>
		<div class="component-content">
			<p>/tv/ possibly just had their most active day yet.</p>
			<p>The day of the GoT finale saw more posts than for any capeshit, star wars movie or academy awards event.</p>
			<p>Recent episodes also marked the first days that /tv/ regularly received more posts than /b/.</p>
			<!--<img src="~/static/1543041166611.jpg" />-->
		</div>
	</div>
</template>

<style scoped lang="scss">
.meta-component {
	display: flex;
	flex-direction: column;
	@include float-shadow-box;
	position: relative;
	//height: 100px;
}

.component-content {
	//background: $--background-content-2n;
	background: var(--background-content);
	display: flex;
	flex-direction: column;
	padding: 1em;
	color: var(--color-text);

	line-height: 1.2;
	//font-size: 0.8em;
}

b {
	text-decoration: underline;
}

hr {
	background: var(--color-text);
	margin: 0.5rem 0;
	width: 10%;
}

p {
	margin: 0;
	&:not(:last-child) {
		margin: 0 0 1rem;
	}
}

img {
	width: 100%;
	object-fit: contain;
}
</style>