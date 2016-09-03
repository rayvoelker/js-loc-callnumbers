// js-loc-callnumbers
// A javascript class to normalize and perform various sorting options on
// Library of Congress Call Numbers within a library institution.

function locCallClass() {
	// the regular expression that defines the Library of 
	// Congress call number. Thanks to Bill Dueber's post on the subject for the regex 
	// http://robotlibrarian.billdueber.com/2008/11/normalizing-loc-call-numbers-for-sorting/
	this.lc = /^\s*([A-Z]{1,3})\s*(\d+(?:\s*\.\s*\d+)?)?\s*(?:\.?\s*([A-Z]+)\s*(\d+)?)?(?:\.?\s*([A-Z]+)\s*(\d+)?)?\s*(.*?)\s*$/;
}

// locCallClass.returnNormLcCall(call_number)
// returns a "normalized" call number
locCallClass.prototype.returnNormLcCall = function(call_number) {
	var result = this.lc.exec(call_number);
	if (!result) {
		throw new Error('Not a Call Number');		
	}
	
	// track the position of what we're looking at in the callnumber 
	var before_first_cutter = true;
	var return_string = "";
	
	// work through the results starting at 1 (the 0 value in the array is the original input)
	for(var i=1; i<=(result.length-1); i++) {
		if (i>1) {
			return_string = return_string + "."
		}
		
		if (i>2) {
			before_first_cutter = false;
		}
		
		return_string = return_string + this.padZed(result[i], before_first_cutter);
	}		
	
	// TODO: consider adding further checks to see if the return string 
	// consists of 8 segments 9 characters and throw an error if not
	return return_string;
}

// locCallClass.isBetween(a, b, c)
// returns true if a <= c <= b
locCallClass.prototype.isBetween = function (a, b, c) {
	var a_norm = this.returnNormLcCall(a),
		b_norm = this.returnNormLcCall(b),
		c_norm = this.returnNormLcCall(c);
	
	if ( (a_norm <= c_norm) && (c_norm <= b_norm) ) {
		return true;
	}
	
	else {
		return false;
	}
}

// locCallClass.sortCallNumbers()
// takes a variable list of call numbers as arguments, and returns 
// a sorted array of call numbers in their original format
locCallClass.prototype.sortCallNumbers = function () {
	var values = [];
		
	for (var i=0; i<arguments.length; i++) {
		values[i]=[];
		values[i][0] = this.returnNormLcCall(arguments[i]);
		values[i][1] = arguments[i];
	}
	
	//sort the 2d array on the [0][] set of values
	values.sort( function (a,b) {
		if (a[0] > b[0]) {
			return 1;
		}
		
		if (a[0] < b[0]) {
			return -1;
		}
		
		return 0;
	});
	
	var return_array = [];
	for (var i=0; i<values.length; i++) {
		return_array[i] = values[i][1];
	}
	
	return return_array;
}

// locCallClass.padZed()
// returns portion of the call number padded out to enable sorting.
locCallClass.prototype.padZed = function (value, before_first_cutter) {
	//pad value with zeros - return value will have a length of 9 
	// The exceptions here are going to be if the number is before the 
	// cutter, then we should treat it as two different parts: whole 
	// number, and decimal portion.

	if(value) {
		if(before_first_cutter && !isNaN(value) ) {
			//this is a number before the first cutter, split it, and then
			// pad each of the parts 
			var int_portion = Math.floor(value).toString();
			var dec_portion = (value % 1).toFixed(3).toString().substr(2,3);
			var pad_zeros = "";
			
			for (var i=0; i<(9 - int_portion.length); i++) {
				pad_zeros = pad_zeros + "0";
			}
			
			return_value = pad_zeros + int_portion;
			
			var pad_zeros = "";
			for (var i=0; i<(9 - dec_portion.length); i++) {
				pad_zeros = pad_zeros + "0";
			}
			
			return_value += "." + dec_portion + pad_zeros;
			return return_value;
		} // end if
	
		else {
			//pad the value to the right
			var pad_zeros = "";
			for (var i=0; i<(9 - value.length); i++) {
				pad_zeros = pad_zeros + "0";
			}

			return value + pad_zeros;
		}
	} 
	
	else {
		return "000000000";
	}
}
