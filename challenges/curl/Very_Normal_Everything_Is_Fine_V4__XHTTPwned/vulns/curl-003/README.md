# What functions and functionality is relevant?
The function `Curl_http_header` is the vulnerable function. It's responsible for parsing http response headers and in this case we added an extra header value to be parsed, `X-Powered-By`.

# Why is this vulnerable?
The vulnerability is due to the fact that the buffer our `X-Powered-By` string is put into is hardcoded and the size is miscalculated in our `memcpy` check. We intended to grab the size of our hardcoded buffer, but instead we *accidentally* grabbed the length of the input itself, allowing for a trivial buffer overflow.

# Is this a replay and/or is inspired by anything?
This is not a replay and isn't inspired by anything other than generally speaking parsing http headers can be difficult and a source of vulnerabilities.

# What makes it interesting?
It's an easy bug to trigger, it's easy to understand, and it's common for developers to mix up arguments to common functions like memcpy. 

# Additional Details
When you navigate to google.com, you send an HTTP request that contains several request headers. These can be things like the requested url(google.com), the request method(GET/POST/PUT, etc.), the content type(json/xml, etc.), and many others. Once google receives this, it will send back an HTTP response that also contains headers. In our case, we care about the `X-Powered-By` header, since that is where our vulnerability is. `X-Powered-By` is a non-standard header for identifying the application or framework that generated this response. It was not chosen for any specific reason for this challenge other than it was a header that existed and had a somewhat easily parseable value field.

# Technical Details
Once we received a response header that matched `X-Powered-By`, we simply parse the result and store it in a stateful struct called `SingleRequest`. The issue is that the array storing that result is hardcoded to have a size of 64. This could obviously be an issue if the function copying in data doesn't account for it, which is our case, it does not. The memcpy responsible for the Stack Buffer Overflow looks like this:

```
 if(HD_VAL(hd, hdlen, "X-Powered-By:")) {
   char *xpoweredby = Curl_copy_header_value(hd);
   memcpy(data->req.xpoweredby, xpoweredby, strlen(xpoweredby));
   return CURLE_OK;
 }
```

The issue is that we've accidentally taken the length of the header copying the value and not the length of the hardcoded buffer. This allows for a trivial buffer overflow if the user sends back an `X-Powered-By` response with a string of > 64 characters.

# Fix
The fix for this could come in many different varieties, but two valid patches might be:

```
   memcpy(data->req.xpoweredby, xpoweredby, 64);
   memcpy(data->req.xpoweredby, xpoweredby, strlen(data->req.xpoweredby));
```

