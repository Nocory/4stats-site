<template>
	<div class="sideImage-component" v-once>
		<img src="~/static/squilliam.jpg" />
	</div>
</template>

<style scoped lang="scss">
.sideImage-component {
	display: flex;
	flex-direction: column;
	position: relative;
	@include float-shadow-box;
}
img {
	width: 100%;
	object-fit: contain;
}
</style>