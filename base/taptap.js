var tap = {
	root: document.body,

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

	setImage: function(btn, img) {
		btn.innerHTML = '';
		if (img) {
			btn.img = tap.dom('img', {src:'/img/'+img+'.svg'});
			btn.area.appendChild(btn.img);
		} else {
			btn.img = null;
		}
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

	feature: function(name) {
		tap.buttons.forEach(function(btn) {
			btn.area.className += ' ' + name;
		});
	},

	state: function(name) {
		tap.root.className = '';
		setTimeout(function() {
			tap.root.className = name;
		},1);
	},

	success: function() {
		tap.state('success');
	},

	fail: function() {
		tap.state('fail');
	},

	//- Sound

	_audios:{},

	preload: function(name) {
		var audio = tap._audios[name];
		if (!audio) {
			audio = tap._audios[name] = document.createElement('audio');
			audio.src = '/snd/'+name+'.mp3';
			audio.preload = true;
			tap.root.appendChild(audio);
		}
		return audio;
	},

	play: function(name/*, name2, ...*/) {
		name = tap.pick(arguments);
		var audio = tap.preload(name);
		audio.currentTime = 0;
		audio.play();
	}


};
