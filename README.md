js-loc-callnumbers
===

A JavaScript class to normalize and perform various sorting options on Library of Congress Call Numbers within a library institution.

My main intended use for this class is to provide sorting and comparison functions for library catalog searches in relationship to the physical location of the material in the library stacks -- although, the other various functions may be useful in other projects.

This is adapted from the efforts of various other developers and projects; including, but not necessarily limited to the following :

[http://robotlibrarian.billdueber.com](http://robotlibrarian.billdueber.com/2008/11/normalizing-loc-call-numbers-for-sorting/)

[http://www-personal.umich.edu/~dfulmer](http://www-personal.umich.edu/~dfulmer/api/lc.html)

[https://code.google.com/p/library-callnumber-lc](https://code.google.com/p/library-callnumber-lc/wiki/Home)

Unfortunately, the regular expression used in this project may have very distinct limitations in your particular institution; so please let me know if anyone out there has a more complete regular expression (or a more reliable way to parse and "normalize") that defines any and all perfectly valid Library of Congress Call Numbers.

TODO:
===
1. Possibly further normalize other instances of volume data stored in the call number:
  ```
  examples
                    1 2 3 4 5
  "vol. 3" -->  "vol        3"
  "num 12" -->  "num      1 2"
  "bk. 444"-->   "bk    4 4 4"
   ```
  
These previous TODOs may be out of scope for this project  
  ~~1. Think about extending the class to a class that maintains "stacks" or "ranges" of call numbers for the purpose of finding items among the those ranges of call numbers. It could be instantiated with either a 1D or 2D array of call numbers in start / end pairs, or with a JSON object that defines the range data (the JSON object being a more easy to maintain solution for the user / system producing the data).
  1. Add a method, or modify the sort method to also return the previous position of each of the sorted items.  
Useful situtations for this might inclued inserting a single, or group of call numbers into a pre-sorted array, sorting the array, and then tracking where those items ended up in relationship to the orginal list.
  1. Add a "reshelve" method to make it simple to read a list, and see if a call number is out of position in relationship to the previos and next call numbers in the list. This method may or may not be outside of the scope of this class, but still could be very useful for implementing a more "on-the-fly" or, near-real-time shelving application.~~
