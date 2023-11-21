-- Enable OLE Automation Stored Procedures
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;
EXEC sp_configure 'Ole Automation Procedures', 1;
RECONFIGURE;

-- Create an instance of the WinHTTP object
DECLARE @WinHttpObject AS INT;
DECLARE @ResponseJsonText AS VARCHAR(8000);
EXEC sp_OACreate 'WinHttp.WinHttpRequest.5.1', @WinHttpObject OUT;

-- Open an HTTP connection to the API
EXEC sp_OAMethod @WinHttpObject, 'open', NULL, 'get', 'https://api.example.com/json';

-- Send the HTTP request and retrieve the response
EXEC sp_OAMethod @WinHttpObject, 'send';
EXEC sp_OAMethod @WinHttpObject, 'responseText', @ResponseJsonText OUTPUT;

-- Destroy the created instance of the object
EXEC sp_OADestroy @WinHttpObject;

-- Parse the JSON response and import it into SQL Server
SELECT *
FROM OPENJSON(@ResponseJsonText)
WITH (
  Column1 VARCHAR(100) '$.column1',
  Column2 INT '$.column2',
  Column3 DATETIME '$.column3'
);
