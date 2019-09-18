// Vue
var MainVue = new Vue({
	el: '#app-container',
	data: {
		mic_volume: 0,
		mic_sensitivity: 3
	}
});

// OnLoad Run
window.addEventListener('load', function() {
	StartMediaListener();
});

function StartMediaListener() {
	navigator.mediaDevices.getUserMedia({ audio: true })
		.then(function(stream) {
			console.log("Accessed the Microphone");

			// Code below from: https://stackoverflow.com/a/52952907/6483987
			audioContext = new AudioContext();
			analyser = audioContext.createAnalyser();
			microphone = audioContext.createMediaStreamSource(stream);
			javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

			analyser.smoothingTimeConstant = 0.8;
			analyser.fftSize = 1024;

			microphone.connect(analyser);
			analyser.connect(javascriptNode);
			javascriptNode.connect(audioContext.destination);
			javascriptNode.onaudioprocess = function() {
				var array = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(array);
				var values = 0;

				var length = array.length;
				for (var i = 0; i < length; i++) {
					values += (array[i]);
				}

				var average = values / length;

				MainVue.mic_volume = Math.round(average);
			}

		})
		.catch(function(err) {
			console.log("The following error occured: " + err.name);
		});
}