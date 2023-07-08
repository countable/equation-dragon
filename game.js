
const STARTING_LEVEL='axiom_shrine'

function message(msg, timeout=2000){
	id('message').innerHTML = msg
	id('message').style.display = 'block'
	setTimeout( () => {
		id('message').style.display = 'none'
		id('message').innerHTML = ''
	}, timeout)
}

var id = (the_id, text) => {
	var els = document.querySelectorAll('.' + the_id)
	if (text) {
		els.forEach((el)=> {
			el.innerText = text
		})
	}
	return els[0];
};

function format_level_name(level) {
	if (level.level) { // when choices passed in
		level = level.level
	}
	return level.replace(/_/g, ' ')
}

function update_screen() {
	id('hero_karma').innerText = get_karma();
	id('friends', Object.keys(friends).length);
	console.log('NAME', level.name, typeof level.name)
	id('level', format_level_name(level.name))
	id('chosen').innerText = level_value;
	id('rule').innerText = rule;
    document.querySelector('.chosen').innerHTML = level_value;
	document.getElementsByTagName('body')[0].className = 'body-'+mode+' body-'+submode;
	
	// choice levels.
	id('story').innerText = story.wording
	if (story.choices) {
		for (let i=0;i<5;i++) {
			if (i < story.choices.length) {
				const choice_name = format_level_name(story.choices[i])
				id('choice'+i).style.display='block'
				choice_level = get_level(story.choices[i])
				
				const action = get_action_word(story.choices[i])
				
				let choice_class
				if (choice_allowed(story.choices[i])) {
					choice_class='key'
				} else {
					choice_class='disabled-key'
				}
				
				id('choice'+i+' p').innerHTML =
					"<span class="+choice_class+">" + i + "</span><br>"
					+ action + ' ' + choice_name
			} else {
				id('choice'+i).style.display='none'
			}
		}
	}

	//id('pet').src=(inventory.pet.name || 'none') + '.png'
}

function get_action_word(level_name) {
	l = get_level(level_name)
	return {
		'solve':'Tame',
		'choice': 'Go to',
		'item': 'Buy'
	}[l.mode]
}

const inventory = {
	pet: {},
};

let level_value = '';
let story = {choices:[]}

let rule = 'Any numbers';
let seeds = [];

let mode='start' // 'solve', 'choice'
let submode='question' //'lost', 'won'
let key_idx = 0;

const letters = ['A','B','C']

// keep track of solved problems.
const friends = {}

function get_karma() {
	let exp = 0
	for (let k in friends) {
		exp += Math.log(friends[k]+1)/Math.log(3)
	}
	return Math.floor(exp)
}

function start_level(name) {
	
	console.log('starting level', name)
	level = get_level(name)

	key_idx = 0;
    mode = level.mode;
	if (level.mode === 'solve') {
		seeds = []
		id('monster img').src = level.name.replace('large_','') + '.png'
		if (level.name.indexOf('large') > -1) {
			id('monster').className='large monster wobble'
		} else {
			id('monster').className='monster wobble'
		}
		for (let i=0;i<10;i++)
			seeds.push(Math.floor(Math.random()*10))
		level_value = level.spec(seeds)
		rule = level.rule(seeds);
	} else if (level.mode === 'choice') {
		story = level.story()
		id('story-img').src = level.name.replace(/\s/g, "_") + '.png'
		console.log('story', story)
	}
	update_screen()
}

let level = Levels[0]

function hurt() {
	sound('hurt')
    key_idx = 0;
    update_screen() // let player see their failure.
    id('chosen').innerHTML='';
    level_value = level.spec(seeds)
}


function get_level_attr(attr) {
	if (level[attr] instanceof Function) {
		return level[attr]()
	} else {
		return level[attr]
	}
}
var music;

function sound(fname) {
	var s = new Audio(fname + '.mp3')
	s.play()
}
function count_friends() {
	return Object.keys(friends).length
}
function choice_allowed(choice_obj) {
	
	if (choice_obj.requirement == "friends") {
		return count_friends() >= choice_obj.qty
	} else if (choice_obj.requirement) {
		return friends[choice_obj.requirement] && friends[choice_obj.requirement] > choice_obj.qty;
	}
	return true
}
document.addEventListener('keypress', function(e) {
	if (mode === 'start') {
		if (e.key === ' ') {
			start_level(STARTING_LEVEL)
			if (!music) {
				music = new Audio('game-music.mp3')
				music.loop = true
				music.volume = 0.25
			}
			music.play()
		}
	} else if (mode === 'solve') {

		if (!isNaN(parseInt(e.key))) {
			let letter = letters[key_idx]
			key_idx++;
			level_value = level_value.replace(new RegExp(letter, "g"),e.key)
			
			value_for_eval = level_value.replace("=", "==")

			if (/.*[ABCDEFG].*/.test(value_for_eval) ) {
				update_screen()
				return
			}
			if (eval(value_for_eval)) {
				submode = 'won'
				sound('win')
				rule = 'Yes! Now ' + format_level_name(level.name) + ' is your friend!'
				update_screen();
				setTimeout( ()=> {
					friends[level.name] = (friends[level.name] || 0) + 1
					submode = 'question'
					id('monster').className = 'monster'
					start_level(get_level_attr('next'))
				}, 2000)

				return
			} else {
				hurt()
			}
			update_screen()
		}
	} else if (mode === 'choice') {
		if (!isNaN(parseInt(e.key))) {
			var choice = story.choices[parseInt(e.key)]
			if (choice) {
				let choice_obj={}
				// choice could be an object
				if (!choice instanceof String) {
					choice_obj = choice;
					choice = choice.level
				}
				if (!choice_allowed(choice_obj)) return
				const choice_level = get_level(choice)
				if (choice_level.mode == 'item') {
				
					if (Object.keys(friends).length >= choice_level.cost) {
						if (inventory[choice_level.type]) {
							inventory[choice_level.type] = choice_level
							message('You got '+choice_level.name+'.')
						} else {
							choice_level.effect()
						}
					} else {
						message('Need mo friends.')
					}
				
				} else {
					start_level(choice)
				}
			} else {
			    message('That choice does not exist.')
			}
			update_screen()
		}
    }
})


update_screen()
