const VERSION = 8
if(localStorage.getItem("VERSION") != VERSION){
	console.log("clearing localstorage")
	localStorage.clear()
	localStorage.setItem("VERSION",VERSION)
}

let config = {
	VERSION,
	availableBoards : {
		default: [
			'3',
			'a',
			'adv',
			'an',
			'asp',
			'bant',
			'biz',
			'cgl',
			'ck',
			'co',
			'diy',
			'fa',
			'fit',
			'g',
			'gd',
			'his',
			'ic',
			'int',
			'jp',
			'k',
			'lgbt',
			'lit',
			'm',
			'mlp',
			'mu',
			'n',
			'news',
			'o',
			'out',
			'p',
			'po',
			'pol',
			'qst',
			'r9k',
			'sci',
			'sp',
			'tg',
			'toy',
			'trv',
			'tv',
			'v',
			'vg',
			'vp',
			'vr',
			'wsr',
			'x',
		],
		imageGenerals:[
			'c',
			'cm',
			'i',
			'w',
			'wg',
			'wsg',
		],
		misc:[
			'f',
			'qa',
			'vip',
		],
		nsfw:[
			'aco',
			'b',
			'd',
			'e',
			'gif',
			'h',
			'hc',
			'hm',
			'hr',
			'r',
			's',
			's4s',
			'soc',
			't',
			'trash',
			'u',
			'y'
		]
	}
}

config.allBoards = [...config.availableBoards.default,...config.availableBoards.imageGenerals,...config.availableBoards.misc,...config.availableBoards.nsfw]

module.exports = config