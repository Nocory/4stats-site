module.exports =  (el, callback) =>{
	let result = ""
	let start = [0,0]
	let end = [0,0]
	let distance = [0,0]
	let startTime = 0
	let elapsedTime = 0

	el.addEventListener('touchstart', function(e){
		start = [e.changedTouches[0].pageX,e.changedTouches[0].pageY]
		startTime = e.timeStamp
	}, false)

	el.addEventListener('touchend', function(e){
		end = [e.changedTouches[0].pageX,e.changedTouches[0].pageY]
		elapsedTime = e.timeStamp - startTime
		distance = [end[0] - start[0],end[1] - start[1]]
		//callback(start,end)
		//callback("distance",distance)
		//callback("elapsedTime",elapsedTime)
    
		let absX = Math.abs(distance[0])
		let absy = Math.abs(distance[1])
		if(absX < 64 && absy < 64)return
		if(absX > absy * 2.5){
			if(distance[0] > 0){
				callback("right")
			}else{
				callback("left")
			}
		}else if(absy > absX * 2){
			if(distance[1] > 0){
				callback("down")
			}else{
				callback("up")
			}
		}
	}, false)
}