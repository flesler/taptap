var tap = {

	//- General utils

	copy: function(dest) {
		dest = dest || {};
		for (var i = 1; i < arguments.length; i++) {
			var src = arguments[i];
			for (var key in src) {
				dest[key] = src[key];
			}
		}
		return dest;
	},

	//- DOM

	root: document.body,
	game: location.pathname.slice(1,-1),

	$: function(id) { return document.getElementById(id); },

	dom: function(tag, attrs, children) {
		var elem = document.createElement(tag);
		if (attrs && attrs.splice) {
			children = attrs;
			attrs = {};
		}
		for (var key in attrs) {
			elem.setAttribute(key, attrs[key]);
		}
		(children||[]).forEach(function(child) {
			if (child) elem.appendChild(child);
		});
		return elem;
	},

	image: function(name, attrs) {
		return tap.dom('img', tap.copy({src:'/img/'+name+'.svg'}, attrs));
	},

	//- Buttons

	setImage: function(btn, img) {
		btn.innerHTML = '';
		if (img) {
			btn.img = tap.image(img);
		} else {
			btn.img = null;
		}
		btn.wrap = tap.dom('div', {'class':'wrap'}, [btn.img]);
		btn.area.appendChild(btn.wrap);
	},

	setup:function(btns, handler) {
		var width = (100 / btns.length).toFixed(2) + '%';

		btns.forEach(function(btn) {
			btn.area = tap.dom('div', {'class':'btn', style:'width:'+width});
			tap.setImage(btn, btn.img);

			btn.area.onclick = function() {
				handler(btn);
			};
		});

		tap.buttons = btns;
		tap.randomize();
	},

	pick: function(arr) {
		// TODO: Store on localStorage, make sequential
		return arr[Math.floor(Math.random()*arr.length)];
	},

	randomize: function() {
		tap.buttons.sort(function() {
			return Math.random() * 2 - 1;
		}).forEach(function(btn) {
			tap.root.appendChild(btn.area);
		});
	},

	//- Animations

	animate: function(elem, animation) {
		elem.classList.remove(animation);
		setTimeout(function() {
			elem.classList.add(animation);
		},1);
	},

	success: function() {
		tap.animate(tap.root, 'success');
		tap.score(true);
	},

	fail: function() {
		tap.animate(tap.root, 'fail');
		tap.score(false);
	},

	//- Audio

	aliases: {
		success:['cheer', 'win2'],
		fail:['tone5']
	},

	_getAudio: function(file) {
		var id = 'snd-'+file;
		var audio = tap.$(id);
		if (!audio) {
			audio = tap.dom('audio', {
				id: id,
				src: '/snd/'+file+'.mp3',
				preload: true
			});
			tap.root.appendChild(audio);
		}
		return audio;
	},

	preload: function(name) {
		var files = tap.aliases[name] || [name];
		files.forEach(tap._getAudio);
	},

	play: function(name) {
		var file = tap.pick(tap.aliases[name] || [name]);
		var audio = tap._getAudio(file);
		audio.currentTime = 0;
		audio.play();
	},

	//- Score

	won:0,
	played:0,

	score: function(won) {
		if (won) tap.won++;
		tap.played++;
		// TODO: Change difficulty
		// TODO: Store in localStorage by game name
	}
};

//- Common UI generated with code

tap.root.appendChild(
	tap.dom('a',{'class':'home', href:'/'}, [
		tap.image('home', {width:50, height:50})
	])
);

// Hide topbar
['load', 'orientationchange', 'resize'].forEach(function(event) {
	window.addEventListener(event, function() { scrollTo(0, 1); });
});
