// js-loc-callnumbers
// A javascript class to normalize and perform various sorting options on
// Library of Congress Call Numbers within a library institution.

// constructor
function locCallClass() {
	
	//define the regular expressions used in the normalization
	this.lc = /([A-Z]{1,3})\s*(\d{1,4})(\.\d+)*(.+)*/ig;
	this.punctuation  = /[.,\/#!$%\^&\*;:{}=\-_`~()]/ig;
	this.lett_num_group = /([A-Z]{1,}\d{1,})/ig;
	this.num_letter_groupings = /(\d{1,})([A-Z]{1,})/ig;
	this.v_dot = /(v\s)(\d{1,})/ig;
	this.no_dot = /(no\s)(\d{1,})/ig;
	
	//define and cache the padding lengths (max pad length is 9)
	this.cache = ['', ' ', '  ', '   ', '    ', '     ', '      ', '       ', '        ', '         '];
	
	// alias the function name for returnNormLcCall
	this.normalize = this.returnNormLcCall;
}


// locCallClass.returnNormLcCall(call_number)
// returns a "normalized" call number
locCallClass.prototype.returnNormLcCall = function(callnumber_string) {
	// this is our eventual return value
	var local_norm = '',
		test = [];
	
	try{
		test = this.lc.exec(callnumber_string.toLowerCase());
	}
	catch (e){
		console.log('undefined call number ' + e);
	}
	
	// if input is not LC, return lower case, trimmed input string, 
	// with certain characters removed
	if (test === null){
		console.log("\"" + callnumber_string + "\"" + " not lc");
		return callnumber_string
			.toLowerCase()
			.trim()
			.replace(/\/{1,}|-{1,}/gi, " "); //replaces "/" and "-" with spaces
	}
	
	// TODO : 
	// remove try block?	
	try {
		if(typeof test[1] !== 'undefined'){
			local_norm = test[1];
		}
		
		local_norm += this.leftPad(test[2],7-test[1].length);
		
		// append the decimal, if there is one
		if(typeof test[3] !== 'undefined'){
			local_norm += test[3];
		}
		
		// remove any leading or trailing whitespace
		local_norm = local_norm.trim();

		// normalize the rest of the call number
		var call_number_remainder = "";
		if (typeof test[4] !== 'undefined'){	
			// step 4. i. convert any punctuation to spaces
			// append letter+number groups with spaces 
			// step 4. remove instances of multiple spaces, leaving only one
			// remove any trailing (or starting) whitespace
			call_number_remainder += test[4]
				.replace(this.punctuation, " ")	//repalce punctuation with spaces
				.replace(this.lett_num_group, "$1 ") //append spaces to letter+number groups
				.replace(this.num_letter_groupings, "$1 $2") //place space between numbers and letters occuring next to eachother
				.replace(/\s{2,}/g," "); //instances of 2 or more consecutive spaces are replaced by one
			
			
			// TODO :
			// consider removing the lastIndex for the following?
			
			// pad out numbers occuring after "v." and "no."
			// note: this calls the helper function for replace "vol_pad()"
			call_number_remainder = call_number_remainder.replace(this.v_dot, this.vol_pad.bind(this));
			this.v_dot.lastIndex = 0;
			
			call_number_remainder = call_number_remainder.replace(this.no_dot, this.vol_pad.bind(this));
			this.no_dot.lastIndex = 0;
			
			// reset the lastIndex so the next regex exec doesn't fail on next try
			this.punctuation.lastIndex = 0;
			
		}
		
		// add a single space to the front of the call_number_remainder
		call_number_remainder = call_number_remainder.trim();
		call_number_remainder = " " + call_number_remainder;
		
		//append the begining of the callnumber to the remainder of the call number
		local_norm += call_number_remainder;
		
		//trim spaces from the end, or the begining of the string
		local_norm = local_norm.trim();
		
	} //end try
	
	catch (e){
		console.log(' no test ');
	}
		
	// reset the lastIndex so the next regex exec doesn't fail on next try
	this.lc.lastIndex = 0;
	
	return local_norm;
	
	
} //end returnNormLcCall


// locCallClass.localeCompare(b,a)
// replicates functionality of the normal compare function 
// so that it may be used in external sorting operations:
// 
// A negative number if the reference string (a) occurs before the 
// given string (b); 
// positive if the reference string (a) occurs after 
// the compare string (b); 
// 0 if they are equivalent.
locCallClass.prototype.localeCompare = function (a, b) {
	try {
		var a_norm = this.returnNormLcCall(a),
			b_norm = this.returnNormLcCall(b);
						
			return ( a_norm < b_norm ? -1 : (a_norm > b_norm ? 1 : 0) );
	}
	catch (err) {
		// console.log("error")
	}
}

// locCallClass.sortCallNumbers()
// takes an array of call numbers and returns a sorted array of call 
// numbers in their original format.
// Using something like the following works to sort as well:
// var loc = new locCallClass();
// var sorted_array = loc.unsorted_callnumber_array.sort(function(a,b) {return loc.localeCompare(a,b)});
locCallClass.prototype.sortCallNumbers = function (callnumbers) {
	// also bind the scope of this to the sort function to be able to call
	// this.localeCompare
	var sorted = callnumbers.sort(function (a,b) {
		return this.localeCompare(a,b);
	}.bind(this));
	
	return sorted;
}

// locCallClass.isBetween(a,b,c)
// returns true if a <= c <= b
locCallClass.prototype.isBetween = function (a,b,c) {
	//this.localeCompare(a, b) <= 0 if in sort order	
	return ( (this.localeCompare(a,c) <= 0 && this.localeCompare(c,b) <=0) ? true : false );
}

// pad the string
locCallClass.prototype.leftPad = function (string, pad_length) {
	// make sure that we're treating the string like a string
	string = string + '';
	pad_length = pad_length - string.length;
	// nothing to pad
	if (pad_length <= 0) { 
		return string;
	}
	
	return this.cache[pad_length] + string;
} // end leftPad

//helper function for volume padding
locCallClass.prototype.vol_pad = function (match, vol_string, num_string, offset, string) {
	// padding out number portion to 5 places
	return vol_string.trim() + this.leftPad(num_string, 5);
}
