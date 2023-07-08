
function get_level(name) {
	if (name.level) name=name.level // nested choices.
	l = Levels.filter(l => l.name === name)[0]
	if (!l) {
		console.error(name, "is not a valid level")
	}
	return l
}

Levels = [
	{
		name: 'welcome',
		mode: 'start'
	},
	{
		name: 'end',
		mode: 'start',
		story: function() {
			music.pause()
			sound('win')
			return
		}
	},
	{
		name: 'axiom_shrine',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "You open your eyes, wondering what is really true.",
				choices: [
					'number_slime',
					'multi_slime_bridge',
					{
						level: 'store',
						requirement: 'friends',
						qty: 5
					},
					{level: 'secret_grove', requirement: 'friends', qty: 12},

				]
			}
			return C
		}
	},
	{
		name: 'multi_slime_bridge',
		mode: 'choice',
		story: function() {
			const C = {
				wording: 'A bridge guarded by multiple slimes.',
				choices: [
					'axiom_shrine',
					{
						level: 'tree3',
						requirement: 'multi_slime',
						qty: 1,
					}
				]
			}
			if (friends['multi_slime']) {
				C.story += 'Multi-slime repaired the bridge.'
			} else {
				C.story += 'The bridge is broken.'
			}
			return C
		}
	},
	{
		name: 'tree3',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "You stumble on a dense cluster of TREE3.",
				choices: [
					'axiom_shrine',
					'beariables',
					{level: 'fractional_cave', requirement: 'beariables', qty:5},
					{level: 'unbeariables', requirement: 'friends', qty: 8},
				]
			}
			return C
		},
	},
	{
		name: 'fractional_cave',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "A cave which is half its own height.",
				choices: [
					'tree3',
				]
			}
			return C
		},
	},
	{
		name: 'secret_grove',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "A hidden thicket behind axiom shrine.",
				choices: [
					'axiom_shrine',
				]
			}
			return C
		},
	},
	{
		name: 'root_tunnels',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "It is not always rational to enter here.",
				choices: [
					'fractional_cave',
				]
			}
			return C
		},
	},
	{
		name: 'exponential_peaks',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "You climb to the highest power.",
				choices: [
					'fractional_cave',
				]
			}
			return C
		},
	},
	{
		name: 'store',
		mode: 'choice',
		story: function() {
			return {
				wording: 'you can buy anything you want if you have enough friends.',
				choices: ['axiom_shrine']
			}
		}
	},
	{
		name: 'potion',
		mode: 'item',
		img: true,
		cost: 7,
		effect: function() {
			message('You healed 3 health.')
			hero_health = Math.max(hero_max_health, hero_health + 3)
		}
	},
	{
		name: 'number_slime',
		mode: 'solve',
		spec: function(seeds) {
			return 'A='+seeds[0]
		},
		rule: function(seeds) {
			return '"A" is a secret number the slime loves. Hint: type '+seeds[0]+'.'
		},
		next: 'add_slime'
	},
	{
		name: 'large_number_slime',
		mode: 'solve',
		spec: function(seeds) {
			return 'AB='+seeds[0]+''+seeds[1]
		},
		rule: function(seeds) {
			return 'Type both digits of the number A then B.'
		},
		next: 'add_slime'
	},
	{
		name: 'green_tunnel',
		mode: 'choice',
		story: function() {
			return {
				wording: "You wander down a narrow green tunnel.",
				choices: ['number_slime', 'axiom_shrine']
			}
		},
	},
	{
		name: 'add_slime',
		mode: 'solve',
		spec: function(seeds) {
			//return 'A+B='+(seeds[0] + seeds[1])
			const first = seeds[1] % (seeds[0] || 1)
			const second = seeds[0] - first
			return first + '+' + second + '=A'
		},
		rule: function(seeds) {
			const first = seeds[1] % (seeds[0] || 1)
			const second = seeds[0] - first
			return 'What is ' + first + ' plus ' + second + '?'
			//return 'Type 2 numbers that add to '+ (seeds[0]+seeds[1])
		},
		next: 'minus_slime',
		reward: 2
	},
	{
		name: 'divide_slime',
		mode: 'solve',
		spec: function(seeds) {
			//return 'A+A+A=B+B'
			const first = seeds[0] % 4 + 1
			const second = seeds[1] % (Math.floor(9/first) + 1) + 1
			return first*second + "/" + first + "=A"
		},
		rule: function(seeds) {
			const first = seeds[0] % 4 + 1
			const second = seeds[1] % (Math.floor(9/first) + 1) + 1
			return 'How many is ' + first + ' can you divide ' + first*second + ' into?'
			//return 'Type 2 numbers, 3 of the first is 2 of the other'
		},
		next: 'divide_slime',
		reward: 5
	},
	{
		name: 'large_divide_slime',
		mode: 'solve',
		spec: function(seeds) {
			//return 'A+A+A=B+B'
			const first = seeds[0] + 1
			const second = seeds[1]
			return first*second + "/" + first + "=A"
		},
		rule: function(seeds) {
			const first = seeds[0] + 1
			const second = seeds[1]
			return 'How many is ' + first + ' can you divide ' + first*second + ' into?'
			//return 'Type 2 numbers, 3 of the first is 2 of the other'
		},
		next: 'divide_slime',
		reward: 5
	},
	{
		name: 'minus_slime',
		mode: 'solve',
		spec: function(seeds) {
			return (seeds[0]||1) + '-' + (seeds[1] % (seeds[0]||1)) + '=A'
		},
		rule: function(seeds) {
			return 'What is ' + (seeds[1] % (seeds[0]||1)) + ' less than ' + seeds[0]
		},

		next: function() {
			if (Math.random() < Math.max(0.3, 0.05*get_karma())) {
				return 'function_slime'
			} else {
				return 'multi_slime'
			}
		},
		reward: 7
	},
	{
		name: 'large_minus_slime',
		mode: 'solve',
		spec: function(seeds) {
			return ((seeds[0]+1) + '' + seeds[1] + '-' + seeds[2]) + '=A'
		},
		rule: function(seeds) {
			return 'What is ' + seeds[2] + ' less than ' + (seeds[0]+1) + '' + seeds[1]
		},
		next: function() {
			if (Math.random() < Math.max(0.3, 0.05*get_karma())) {
				return 'large_function_slime'
			} else {
				return 'large_multi_slime'
			}
		},
		reward: 7
	},
	{
		name: 'function_slime',
		mode: 'solve',
		spec: function(seeds) {
			return 'A+A+A='+(seeds[0] * 3)
		},
		rule: function(seeds) {
			return 'Type a number, 3 of it is '+ (seeds[0]*3)
		},

		next: 'axiom_shrine',
		reward: 7
	},
	{
		name: 'large_function_slime',
		mode: 'solve',
		spec: function(seeds) {
			return 'A*A*A='+(seeds[0] * seeds[0] * seeds[0])
		},
		rule: function(seeds) {
			return 'Type a number, which times itself twice is '+ (seeds[0]*3)
		},

		next: 'axiom_shrine',
		reward: 7
	},
	{
		name: 'multi_slime',
		mode: 'solve',
		spec: function(seeds) {
			//return 'A+A+A=B+B'
			const first = seeds[0] % 4 + 1
			const second = seeds[1] % (Math.floor(9/first) + 1)
			return first + "*" + second + '=A'
		},
		rule: function(seeds) {
			const first = seeds[0] % 4 + 1
			const second = seeds[1] % (Math.floor(9/first) + 1)
			return 'How many is ' + first + ' times ' + second + '?'
			//return 'Type 2 numbers, 3 of the first is 2 of the other'
		},
		reward: 10,
		key: 'tree3',
		next: 'axiom_shrine'
	},
	{
		name: 'large_multi_slime',
		mode: 'solve',
		spec: function(seeds) {
			const first = seeds[0]
			const second = seeds[1]
			return first + "*" + second + '=A'
		},
		rule: function(seeds) {
			const first = seeds[0]
			const second = seeds[1]
			return 'How many is ' + first + ' times ' + second + '?'
		},
		reward: 10,
		key: 'tree3',
		next: 'axiom_shrine'
	},
	{
		name: 'beariables',
		mode: 'solve',
		spec: function(seeds) {
			return seeds[1] + seeds[0] + '-A='+seeds[0]
		},
		rule: function(seeds) {
			return 'You have '+(seeds[1] + seeds[0])+' berries. How many would you eat, to have '+seeds[0]+' left?'
		},
		reward: 5,
		next: 'cobeariables'
	},
	{
		name: 'unbeariables',
		mode: 'solve',
		spec: function(seeds) {
			return seeds[0] +'*A='+seeds[0] * seeds[1]
		},
		rule: function(seeds) {
			return 'How many batches of '+seeds[0]+' berries would be '+(seeds[0]*seeds[1])+' berries all told?'
		},
		reward: 5,
		next: 'uncobeariables'
	},
	{
		name: 'cobeariables',
		mode: 'solve',
		spec: function(seeds) {
			return seeds[1] + seeds[0] + '='+seeds[0] + "+A"
		},
		rule: function(seeds) {
			return 'You have '+(seeds[0])+' berries. How many must you pick, to have '+(seeds[0]+seeds[1])+' left?'
		},
		reward: 5,
		next: 'tree3'
	},
	{
		name: 'uncobeariables',
		mode: 'solve',
		spec: function(seeds) {
			return seeds[0] + '*A+' + seeds[1] +'='+ (seeds[0]*seeds[2] + seeds[1])
		},
		rule: function(seeds) {
			return 'Mmmm, berries. What is my favourite number?'
		},
		reward: 5,
		next: 'tree3'
	},
	{
		name: 'numerator',
		mode: 'solve',
		spec: function(seeds) {
			return seeds[0]+'/'+seeds[0]*seeds[2]+"=A/"+seeds[1]*seeds[2]
		},
		rule: function(seeds) {
			return 'Make these fractions match.'
		},
		reward: 5,
		next: 'tree3'
	},
]
