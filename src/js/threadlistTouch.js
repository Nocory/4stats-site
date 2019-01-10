export default (el, callback) =>{
	let start = [0,0]
	let end = [0,0]

	el.addEventListener('touchstart', function(e){
		start = [e.changedTouches[0].pageX,e.changedTouches[0].pageY]
	}, false)

	el.addEventListener('touchend', function(e){
		end = [e.changedTouches[0].pageX,e.changedTouches[0].pageY]
		const distance = [end[0] - start[0],end[1] - start[1]]
    
		const absX = Math.abs(distance[0])
		const absy = Math.abs(distance[1])

		if(absX < 64 && absy < 64)return
		if(absX > absy * 2.5){
			if(distance[0] > 0){
				callback("right")
			}else{
				callback("left")
			}
		}else if(absy > absX * 2.5){
			if(distance[1] > 0){
				callback("down")
			}else{
				callback("up")
			}
		}
	}, false)
}