console.log("NODE_ENV is:", process.env.NODE_ENV)
console.log("DEBUG is:", process.env.DEBUG)

//import "babel-polyfill"

if(location.hostname === "4statstest.netlify.com"){
	(function() {
		var errorBoxElement = false;
		var showError = function(error) {
			if (!errorBoxElement) {
				errorBoxElement = document.createElement('div');
				errorBoxElement.style.position = 'absolute';
				errorBoxElement.style.top = '0';
				errorBoxElement.style.bottom = '0';
				errorBoxElement.style.left = '0';
				errorBoxElement.style.right = '0';
				errorBoxElement.style.background = 'rgba(255, 0, 0, 0.7)';
				errorBoxElement.style.zIndex = 1000000;
				errorBoxElement.style.color = '#fff';
				errorBoxElement.style.padding = '10px';
				document.body.appendChild(errorBoxElement);
			}
			var errorLine = document.createElement('div');
			errorLine.innerHTML = error;
			errorBoxElement.appendChild(errorLine);
		};
		window.onerror = function(errorMsg, url, lineNumber) {
			showError('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
		}
	})();
}


import "css/main.scss"

import Vue from "vue/dist/vue.runtime.esm.js"
import app from "../components/app.vue"

import store from "../store/index.js"

new Vue({
	el: '#app',
	store,
	render: h => h(app)
})

//import socket from "./native_socket.js"