# Description

This is a more advanced version of the simpler gzip backdoor.

For this to be triggered:

  a) the file must be a "concatenated gzip"
  b) this set of equations must be solved and 
     the correct metadata written to the second gzip stream:
  
```java
if (Math.pow(compressionLevel, operatingSystem) == parameters.getModificationTime() &&
        Math.pow(operatingSystem, compressionLevel) == 841L) ...
```