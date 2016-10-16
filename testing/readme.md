ILS style call number normalization
===

Purpose
---
This method should create normalized forms of library of congress call numbers that are efficiently stored (in a database, spreadsheet, flat file, etc.), as well as constantly identify and parse call numbers into their normalized forms.

Method Description
---
1. alphabetic characters are set to lowercase
1. remove anything that is considered a "pre-stamp" from the callnumber
1. identify the "beginning" of the call number
	1. search for 1 to 3 alphabetic characters (letter portion) 
	followed by 1 to 4 numeric characters (the number portion). 
		1. If there is a decimal after the 1 to 4 numeric 
		characters (followed by more numeric characters) then pull 
		those values in as part of the number portion
	1. using the above description, we now use this data to 
	construct the "beginning" of our call number.
		1. using seven character positions ( 1 2 3 4 5 6 7 ) place the 
		letter portion into positions 1 through 3, and then the number 
		portion into positions 4 through 7, right justifying, leaving 
		spaces in the unoccupied positions. For example, given the call 
		number "QL697.4 .H69 2010", we would identify the "beginning" 
		as "QL697.4", and fill out our seven character positions in the 
		following way:
		```
		1 2 3 4 5 6 7    
		q l     6 9 7 . 4
		```
		
		(note, that we included the ".4" after position 7, as it's 
		still part of the number portion)
		
		so, the normalized "beginning" of the call number would look 
		like the following:
		```
    ql  697.4
		```
    
		**regex for capturing this "beginning" portion** (note that this 
		should return 1 match per valid LC call number, and have 4 
		possible groups 1) letter portion, 2) number portion, 3) 
		possible decimal portion of the number, and 4) the rest of the 
		call number
		
		```
		/([A-Z]{1,3})\s*(\d{1,4})(\.\d+)*(.+)*\ig 
		```
1. after this beginning portion, the rest of the number is further 
normalized
	1. convert any punctuation to spaces 
	
	1. remove instances of multiple spaces, leaving only one 
	
	1. *think about maybe normalizing volume data here as well in the 
	following way:
		1. identify volume characters ("vol", "v.", "no", "n.", etc) 
		and then place numbers following the volume characters into a 
		five character positions, right justifying. For example:
		vol 151
		normalizes to ..
		```
		    1 2 3 4 5
		vol     1 5 1
		```
		or ...
    		
		```
		vol   151
		```
		
	Finishing up with our example, our call number ("QL697.4 .H69 
	2010") would final, normalized call number would end up looking 
	like the following:
	```
	QL697.4 .H69 2010
	ql  697.4 h69 2010
	```
  
