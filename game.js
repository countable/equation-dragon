
const STARTING_LEVEL=localStorage['level'] || 'axiom_shrine'

let timeout_id = 0;
function message(msg, timeout=2000){
	id('message').innerHTML = msg
	id('message').style.display = 'block'
	timeout_id = setTimeout( clear_message, timeout)
}
clear_message = () => {
	id('message').style.display = 'none'
	id('message').innerHTML = ''
	if (timeout_id) clearTimeout(timeout_id)
	timeout_id = 0;
}

function show_friends(){
	fd_html = "FRIENDS:<br>"+Object.keys(friends).map((fd)=>{
		let w = fd.includes("large") ? 60: 45;
		return "<img src='"+get_img_src(fd)+"' width="+w+">" + friends[fd] + ' '
	}).join('')
	fd_html += '<br><br>ITEMS:<br>'
	fd_html += Object.keys(inventory).map((inv)=>{
		return inv + (inventory[inv] ? ": <img src='"+get_img_src(inventory[inv])+"' width=60><br>": "<br>")
	}).join('')
	message(fd_html, 5000)
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
	if (already_hurt) {
		id('player').style.transform='rotateZ(-90deg)'
	} else {
		id('player').style.transform=''
	}
	id('friends', Object.keys(friends).length);
	console.log('NAME', level.name, typeof level.name)
	id('level', format_level_name(level.name))
	let lv = format_level_value(level_value);
	id('rule').innerHTML = rule;
    document.querySelector('.chosen').innerHTML = lv;
	document.getElementsByTagName('body')[0].className = 'body-'+mode+' body-'+submode;
	
	// choice levels.
	id('story').innerText = story.wording
	if (story.choices) {
		for (let i=0;i<5;i++) {
			if (i < story.choices.length) {
				const choice = story.choices[i]
				const choice_name = format_level_name(choice)
				id('choice'+i).style.display='block'
				//choice_level = get_level(story.choices[i])
				const action = get_action_word(choice)
				
				let choice_class
				if (choice_allowed(choice)) {
					choice_class='key'
				} else {
					choice_class='disabled-key'
				}
				requirement = ''
				if (choice.requirement) {
					requirement = ' <br><img src="'+get_img_src(choice.requirement)+'" width=35>'+
					'<span style="color:darkblue">'+(choice.qty||'')+'</span>'
				}
				id('choice'+i+' p').innerHTML =
					"<span class="+choice_class+">" + i + "</span><br>"
					+ action + ' ' + choice_name + requirement
			} else {
				id('choice'+i).style.display='none'
			}
		}
	}

	id('pet').src=(inventory.pet || 'none') + '.png'
	id('holding').src=(inventory.holding || 'none') + '.png'
	id('consumable').src=(inventory.consumable || 'none') + '.png'
}

function get_action_word(level) {
	const mode = level.mode || get_level(level).mode
	return {
		'solve':'Tame',
		'choice': 'Go to',
		'item': 'Buy'
	}[mode]
}

const inventory = JSON.parse(localStorage['inventory'] || "{}")

let level_value = '';
let story = {choices:[]}

let rule = 'Any numbers';
let seeds = [];

let mode='start' // 'solve', 'choice'
let submode='question' //'lost', 'won'
let key_idx = 0;

const letters = ['A','B','C']

// keep track of solved problems.
let friends = JSON.parse(localStorage['friends'] || '{}')

function get_karma() {
	let exp = 0
	for (let k in friends) {
		exp += Math.log(friends[k]+1)/Math.log(3)
	}
	return Math.floor(exp)
}

function get_img_src(name) {
	return name.replace('large_','') + '.png'
}

function start_level(lvl) {
	
	console.log('starting level', lvl)
	level = get_level(lvl)
	localStorage['level'] = level.name

	key_idx = 0;
    mode = level.mode;
	if (level.mode === 'solve') {
		seeds = []
		id('monster img').src = get_img_src(level.name)
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
let already_hurt = false;

function hurt() {
	sound('hurt')
	if (already_hurt) {
		if (inventory.consumable == 'potion') {
			already_hurt=false;
			message('Drank potion.')
			delete inventory.consumable
			localStorage['inventory'] = JSON.stringify(inventory)
		} else {
			message('You black out. When you awaken, you see a familiar shrine.')
			start_level('axiom_shrine')
			already_hurt=false;
		}
		
	} else {
		already_hurt=true;
	}
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
	}
	else if (choice_obj.requirement == "karma") {
		return get_karma() >= choice_obj.qty
	} else if (choice_obj.requirement) {
		return (friends[choice_obj.requirement] && friends[choice_obj.requirement] >= choice_obj.qty)
		   || (inventory.holding && inventory.holding==choice_obj.requirement)
	}
	return true
}

/**
 *   Takes strings like "1*1" and returns "1x1"
 */
function format_level_value(formula) {
	formula = formula.replace("*", "&times;").replace("*", "&times;")
	formula = formula.replace("&&", "AND").replace("&&", "AND")
	formula = formula.replace(">", "&gt;").replace(">", "&gt;")
	formula = formula.replace("<", "&lt;").replace("<", "&lt;")
	return formula
}

function reset_game() {
	if (confirm('reset game to start?')) {
		friends = {}
		localStorage.clear()
		start_level('axiom_shrine')
	}
}

function get_variable_for(num){
	if (num<10) {
		return 'A'
	} else if (num < 100) {
		return 'AB'
	} else if (num < 1000) {
		return 'ABC'
	} else {
		return 'ABCD'
	}
}
document.addEventListener('keypress', function(e) {
	
	if (timeout_id) return clear_message()
	
	if (e.key == 'r') {
		reset_game()
	}
	if (e.key == 'm') {
		show_friends()
	}
	
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

		if (isNaN(parseInt(e.key))) {

		} else {
			let letter = letters[key_idx]
			key_idx++;
			level_value = level_value.replace(new RegExp(letter, "g"),e.key)
			
			value_for_eval = level_value.replace("=", "==").replace("&gt;", ">").replace("&lt;", "<")

			if (/.*[ABCDEFG].*/.test(value_for_eval) ) {
				update_screen()
				return
			}
			if (eval(value_for_eval)) {
				submode = 'won'
				sound('win')
				let karma_before = get_karma()
				rule = 'Yes! Now ' + format_level_name(level.name) + ' is your friend :)'
				friends[level.name] = (friends[level.name] || 0) + 1
				if (get_karma()>karma_before) {
					rule += " You got Karma <img src='karma.png' width=35>"
					id('monster img').src = 'karma.png'
				}
				update_screen();
				setTimeout( ()=> {
					localStorage['friends'] = JSON.stringify(friends)
					submode = 'question'
					id('monster').className = 'monster'
					start_level(get_level_attr('next'))
				}, 3000)

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
				let choice_obj=choice
				// choice could be an object
				if (choice instanceof String) {
					choice_obj = {};
				}
				if (!choice_allowed(choice_obj)) return
				const mode = choice.mode || get_level(choice).mode
				if (mode == 'item') {
					// buy a thing
					if (Object.keys(friends).length >= choice.qty) {
						inventory[choice.type] = choice.level
						message('You got '+choice.level+'.' + choice.description + '.<br><img src="'+choice.level+'.png">')
						localStorage['inventory'] = JSON.stringify(inventory)
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
