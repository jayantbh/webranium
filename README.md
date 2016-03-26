# webranium
Text obfuscation engine.

### Note:
If there are errors in XMLDOM, or basically SVG parsing and font generation 
and stuff (in short, if it mentions xmldom or sax.js), go to `node_modules/xmldom/sax.js`
 and on around line 36, add this as the first line of the `parse` function definition:
     
	source = source.toString();
	
That should fix it.
