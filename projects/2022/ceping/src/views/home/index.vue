<template>
  <div id="box">
		<img src="~assets/img/pingce01/1-button.png" class="button" @click="goToAnswer()">
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
const $router =useRouter()
function goToAnswer(){
	$router.push('/answer')
}
</script>

<style scoped>
#box {
	width: 100vw;
	height: 100vh;
  margin: 0 auto;
	position: relative;
	background: url(~assets/img/pingce01/1.png) no-repeat center;
}
#box img{
	position: absolute;
	bottom: 25vh;
	left: 27vw;
}
</style>