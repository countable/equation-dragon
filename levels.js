
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
		name: 'secret_grove',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "A grove of infinite color.",
				choices: [
					'axiom_shrine',
					'large_number_slime',
				]
			}
			return C
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
						level: 'store'
					},
					{level: 'secret_grove', requirement: 'friends', qty: 12},

				]
			}
			if (already_hurt) {
				message("Your hurt feelings are healed.")
			}
			already_hurt = false;
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
					},
					{
						level: 'tree4',
						requirement: 'friends',
						qty: 15
					},
					{
						level: 'quiz_troll',
						requirement: 'karma',
						qty: '7'
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
					'multi_slime_bridge',
					'beariables',
					{level: 'fractional_cave', requirement: 'beariables', qty:5},
					{level: 'unbeariables', requirement: 'friends', qty: 8},
				]
			}
			return C
		},
	},
	{
		name: 'tree4',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "The branches of TREE4 extend upward into the sky.",
				choices: [
					'multi_slime_bridge',
					'owl_zero',
					{level: 'door_1', requirement: 'key'}
				]
			}
			return C
		},
	},
	{
		name: 'door_1',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "You enter the first gate.",
				choices: [
					'tree4',
					{level: 'door_2', requirement: 'large_multi_slime', qty:3}
				]
			}
			return C
		},
	},
	{
		name: 'door_2',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "You enter the first gate.",
				choices: [
					'door_1',
					{level: 'door_3', requirement: 'large_multi_slime', qty:3}
				]
			}3
			return C
		},
	},
	{
		name: 'door_3',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "You enter the final gate.",
				choices: [
					'door_2',
					'sequence_specter',
					{level: 'exponential_peaks', requirement: 'denominator', qty:3}
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
				wording: "A cave which is half as tall.",
				choices: [
					'tree3',
					'numerator',
					'denominator',
					'root_tunnels',
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
					'root_digger',
					'fractional_cave',
				]
			}
			return C
		},
	},
	{
		name: 'lower_root_tunnels',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "It is not always rational to go deeper.",
				choices: [
					'root_tunnels',
					'deep_root_digger',
				]
			}
			return C
		},
	},
	{
		name: 'deep_root_tunnels',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "It is not always rational to go deeper.",
				choices: [
					'lower_root_tunnels',
					'catacomb',
					'deep_root_digger',
				]
			}
			return C
		},
	},
	{
		name: 'catacomb',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "It is not always rational to go deeper.",
				choices: [
					'deep_root_tunnels',
					'catacomb',
					'catkuna',
					'racuna'
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
					'door_3',
					'equation_dragon'
				]
			}
			return C
		},
	},
	{
		name: 'end',
		mode: 'choice',
		story: function() {
			const C = {
				wording: "You have found a dragon math friend. Thanks for playing our game. (Jasnah and Clark)",
				choices: [

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
				choices: [
					'axiom_shrine',
					{
						level: 'key',
						mode:'item',
						type:'holding',
						requirement: 'karma',
						description: 'opens first door.',
						qty: 20},
					{
						level: 'potion',
						mode:'item',
						type:'consumable',
						requirement: 'karma',
						description: 'makes you feel better.',
						qty: 10},
					{
						level: 'cat',
						mode:'item',
						type:'pet',
						requirement: 'catkuna',
						description: 'increases karma.',
						qty: 3},
					]
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
		name: 'quiz_troll',
		mode: 'solve',
		spec: function(seeds) {
			return "A&gt;" + (seeds[0]-1)+" && A&lt;"+(seeds[0]+1)
		},
		rule: function(seeds) {
			return 'Choose a number between '+(seeds[0]-1)+" AND "+(seeds[0]+1)
		},
		next: 'multi_slime_bridge'
	},
	{
		name: 'equation_dragon',
		mode: 'solve',
		spec: function(seeds) {
			let ans = (seeds[0] * seeds[1]) - (seeds[2] * seeds[3])
			return ans + "=A*B-C*"+seeds[3]
		},
		rule: function(seeds) {
			return 'Solve for A,B,C,D'
		},
		next: 'end'
	},
	
	{
		name: 'root_digger',
		mode: 'solve',
		spec: function(seeds) {
			return "A=Math.sqrt("+(seeds[0]*seeds[0])+")"
		},
		rule: function(seeds) {
			return 'What number times itself is '+(seeds[0]*seeds[0])+'?'
		},
		next: 'lower_root_tunnels'
	},
	{
		name: 'deep_root_digger',
		mode: 'solve',
		spec: function(seeds) {
			let ans = seeds[0]+seeds[1]
			let v = get_variable_for(ans)
			return v+"=Math.sqrt("+(ans * ans)+")"
		},
		rule: function(seeds) {
			return 'What number times itself is '+ans*ans+'?'
		},
		next: 'deep_root_tunnels'
	},
	{
		name: 'catkuna',
		mode: 'solve',
		spec: function(seeds) {
			v = get_variable_for(seeds[0]*seeds[1]*seeds[2])
			return v+"="+seeds[0]+"*"+seeds[1]+"*"+seeds[2]
		},
		rule: function(seeds) {
			return 'Multiply 3 numbers.'
		},
		next: 'lower_root_tunnels'
	},
	{
		name: 'racuna',
		mode: 'solve',
		spec: function(seeds) {
			v = get_variable_for(seeds[0]+seeds[1]+seeds[2]+seeds[3]+seeds[4])
			return v+"="+seeds[0]+"+"+seeds[1]+"+"+seeds[2]+"+"+seeds[3]+"+"+seeds[4]
		},
		rule: function(seeds) {
			return 'Add 5 numbers.'
		},
		next: 'lower_root_tunnels'
	},
	{
		name: 'owl_zero',
		mode: 'solve',
		spec: function(seeds) {
			v = get_variable_for(seeds[0]*seeds[1]+seeds[2])
			return "0="+v+"-("+seeds[0]+"*"+seeds[1]+"+"+seeds[2]+")"
		},
		rule: function(seeds) {
			return 'Owl says, solve the equation so it equals zero.'
		},
		next: 'tree4'
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
		next: 'large_add_slime'
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
	},
	{
		name: 'large_add_slime',
		mode: 'solve',
		spec: function(seeds) {
			//return 'A+B='+(seeds[0] + seeds[1])
			const first = seeds[0] + seeds[1]
			const second = seeds[2] + seeds[3]
			let ans = first+second
			return first + '+' + second + '=' + get_variable_for(ans)
		},
		rule: function(seeds) {
			const first = seeds[0] + seeds[1]
			const second = seeds[2] + seeds[3]
			return 'What is ' + first + ' plus ' + second + '?'
			//return 'Type 2 numbers that add to '+ (seeds[0]+seeds[1])
		},
		next: 'large_minus_slime',
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
		next: function() {
			if (Math.random() < Math.max(0.15, 0.03*get_karma())) {
				return 'large_divide_slime'
			} else {
				return 'axiom_shrine'
			}
		}
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
		next: 'secret_grove',
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
	},
	{
		name: 'large_minus_slime',
		mode: 'solve',
		spec: function(seeds) {
			return ((seeds[0]+1) + seeds[1] + '-' + seeds[1]) + '=' + get_variable_for(seeds[0]+1)
		},
		rule: function(seeds) {
			return 'What is ' + seeds[1] + ' less than ' + (seeds[0]+1 + seeds[1])
		},
		next: function() {
			if (Math.random() < Math.max(0.1, 0.02*get_karma())) {
				return 'large_function_slime'
			} else {
				return 'large_multi_slime'
			}
		},
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
			return "A*(A-1)=" + (seeds[0]||1)*((seeds[0]||0)-1)
		},
		rule: function(seeds) {
			return 'Solve for A.'
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
		next: function() {
			if (Math.random() < 0.07*get_karma()) {
				return 'divide_slime'
			} else {
				return 'axiom_shrine'
			}
		},
	},
	{
		name: 'large_multi_slime',
		mode: 'solve',
		spec: function(seeds) {
			const first = seeds[0]
			const second = seeds[1]
			return first + "*" + second + '=' + get_variable_for(first*second)
		},
		rule: function(seeds) {
			const first = seeds[0]
			const second = seeds[1]
			return 'How many is ' + first + ' times ' + second + '?'
		},
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
			return 'You have '+(seeds[0])+' berries. How many must you pick, to have '+(seeds[0]+seeds[1])+'?'
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
			var denom = (seeds[0]+2)*2
			return '1/2='+get_variable_for(denom/2)+'/'+denom
		},
		rule: function(seeds) {
			return 'Make these fractions match.'
		},
		reward: 5,
		next: 'fractional_cave'
	},
	{
		name: 'large_numerator',
		mode: 'solve',
		spec: function(seeds) {
			return seeds[0]+'/'+seeds[0]*seeds[2]+"=A/"+seeds[1]*seeds[2]
		},
		rule: function(seeds) {
			return 'Make these fractions match.'
		},
		reward: 5,
		next: 'fractional_cave'
	},
	{
		name: 'denominator',
		mode: 'solve',
		spec: function(seeds) {
			let s0 = seeds[0] || 1
			let s1 = seeds[1] || 1
			let s2 = seeds[2] || 1
			let v = get_variable_for(s2*s1)
			return s0+'/'+s0*s2+"="+s1+"/"+v
		},
		rule: function(seeds) {
			return 'Make these fractions match.'
		},
		reward: 5,
		next: 'fractional_cave'
	},
	{
		name: 'sequence_specter',
		mode: 'solve',
		spec: function(seeds) {
			let ans=0
			let eq= ''
			for (var i=1;i< seeds[0];i++) {
				eq += "+"+i
				ans += i
			}
			eq = get_variable_for(ans) + "=0"+eq
			return eq
		},
		rule: function(seeds) {
			return 'What is the sum?'
		},
		reward: 5,
		next: 'tree3'
	},
]
