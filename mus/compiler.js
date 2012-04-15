var compile = function (musexpr) {
    var notes = [];
    compileT(0, musexpr, notes);
    return notes;
};

var compileT = function(time, musexpr, notes){
    var left, right, end;
    switch(musexpr.tag){
        case 'seq':
            left = compileT(time, musexpr.left, notes);
            end = endTime(time, musexpr.left);
            right = compileT(end, musexpr.right, notes);
            break;
		case 'par':
            left = compileT(time, musexpr.left, notes);
            right = compileT(time, musexpr.right, notes);
            break;
        default:
            musexpr.start = time;
            notes.push(musexpr);
            break;
    }
};

var endTime = function(time, expr){
	switch(expr.tag){
		case 'seq':
			return time + endTime(0, expr.left) + endTime(0, expr.right);
		case 'par':
			return time + Math.max(endTime(0, expr.left), endTime(0, expr.right));
		default:
			return time + expr.dur;
	}
};

var melody = { 
	tag: 'seq',
	left: { 
		tag: 'seq',
		left: { tag: 'note', pitch: 'a4', dur: 250 },
		right: { tag: 'note', pitch: 'b4', dur: 250 } 
	},
	right:{ 
		tag: 'seq',
		left: {
			tag: 'seq',
			left: {
				tag: 'rest',
				dur: 100
			},
			right: {tag: 'note', pitch: 'c4', dur: 500}
		},
		right: { tag: 'note', pitch: 'd4', dur: 500 } 
	} 
};

console.log(melody);
console.log(compile(melody));