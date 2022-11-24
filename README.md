<br/>
<h1 align="center">
  marcador.io
</h1>

<p align="center">A high-availability HTTP API to keep track of a score, rate, grade, or any other numeric value, associated with an item, user, or client.</p>
<br/>
<p align="center">To use this HTTP API you will need to go through RapidAPI.</p>
<br/>
<div style="text-align: center">
<img src="https://img.shields.io/badge/marcador.io-v1.1-blue" alt="NPM Version" />
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/github/issues-raw/arianlopezc/marcador.io" alt="Package License" /></a>
</div>
<br/>

## Overview

Marcador.io allows you to assign a numeric value to an identifier that represents an item, to a client or user of your system, by performing one of the following operations: add, subtract, add percentage, subtract percentage, and set value.
<br/>
<br/>
These operations can be directly performed by making requests to the appropriate endpoints, or by uploading a CSV file with operations represented as records to the API. All of the records and requests on the endpoints will be processed as events in the order that they are sent to marcador.io.
<br/>
<br/>
The service has been conceived in such a way, that no matter how many events you submit with operations for a specific item, they will be processed almost immediately, and the value associated with the item will be available with the most recent applied event represented in it.
<br/>
<br/>
<br/>
One very important note!
<br/>
<br/>
If you decide to submit a CSV file holding events to be processed, keep in mind, while the file is still being processed, any event submitted through the events endpoint will be processed at the same time as the file. If you expect the events to be processed in some specific order, please keep that in mind. The good news is, that no matter how many operations you send, the final value will be the expected one due to the very nature of the operations we run. Of course, as long as your requests do not fail due to some validation issue or unexpected error in the API.
<br/>
<br/>

## Features

[Get Item](#get-item)

[Post Item Event](#post-item)

[Referenced Events on Items](#events-referenced-items)

[Get Item Events](#get-item-events)

[Delete Item](#delete-item)

[Export Items](#export-items)

[Import Items Events](#import-items-events)

[Get Client](#get-client)

[Post Client Event](#post-client)

<br/>
<hr/>
<br/>

<a name="get-item">

   ## Get Item
</a>

Returns the data for the associated identifier.
<br/>
<br/>
`Request`

```
POST /v1/merchant/item

BODY
{
    "itemId":"8bc5bfec-c6a6-4b6f-95ec-5594e9d51063"
}
```

`itemId` - key represents the identifier that you which to fetch for.

- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

<br/>

`Response`

```
Http 204

This code will be returned when there is no item associated to the `itemId` provided.
```

<br/>

```
Http 200

{
    "itemId": "8bc5bfec-c6a6-4b6f-95ec-5594e9d51063",
    "total": 100,
    "createdOn": "2022-11-18T19:50:12.490-05:00",
    "lastUpdatedOn": "2022-11-18T19:50:12.490-05:00"
}
```

`itemId` - unique key that is associated with the data.

`total` - the numeric value of the item.

`createdOn` - date time when the item was created, expressed in ISO 8601 format.

`lastUpdatedOn` - date time when the item was last modified, expressed in ISO 8601 format.

<br/>

<a name="post-item">

   ## Post Item Event
</a>

Submits an event to be applied to the item's total. If the item does not exist, it creates it.
<br/>
<br/>
`Request`

```
POST /v1/merchant/item/events/post

BODY - Option 1
{
    "itemId":"8bc5bfec-c6a6-4b6f-95ec-5594e9d51063",
    "operation": "set"|"add"|"subtract",
    "total": 100,
    "referenceId": "5594e9d51063" (optional)
}

BODY - Option 2
{
    "itemId":"8bc5bfec-c6a6-4b6f-95ec-5594e9d51063",
    "operation": "add_percentage"|"subtract_percentage",
    "percentage": 100,
    "referenceId": "5594e9d51063" (optional)
}
```

`itemId` - unique key that is associated with the data.

- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

`operation` - which action you wish to perform over the item's total

- set - it sets the specified value as the item's total.
- add - it adds the specified amount to the item.
- subtract - it reduces the specified amount from the item.
- add_percentage - it increases the item's total by the specified percentage.
- subtract_percentage - it reduces the item's total by the specified percentage.

`total` - the numeric value to be used for the operation.

- must be a number between 0 and 999999999999, with up to 5 decimal places.

`percentage` - the percentage value to be used for the operation.

- must be a number between 0 and 999999999999, with up to 5 decimal places.

`referenceId` - this can be used to associate the event you are submitting to the API with anything you wish. The value doesn't need to be a unique key and can be used with other events to link them together.

- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

`comment` - any comment you deem relevant.

- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

<br/>

`Response`

```
Http 204

This code will be returned when the event was submitted succesfully.
```

<br/>

<a name="events-referenced-items">

  ## Referenced Events on Items
</a>

Paginated endpoint that provides the recorded and applied events associated to a given reference id.

The paginated events will be returned order by date in which they were applied, with the most recent listed first and the least recent listed last.
<br/>
<br/>
`Request`

```
GET /v1/merchant/item/events/referenced?referenceId=5594e9d51063&start=0&limit=20
```

`referenceId` - the value used to reference one or more submitted events.

- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

`start` - optional value to specify from which index do you wish to start the page to be queried.

- If not specified, a value of 0 will be used as default.

`limit` - optional value to specify how many items should be queried from the start index value.

- If not specified, a value of 20 will be used as default.
- Min accepted value is 1 and max accepted value will be 30.

<br/>

`Response`

```
Http 200

{
    "limit": 2,
    "size": 2,
    "start": 2,
    "total": 6,
    "results": [
        {
            "referenceId": "5594e9d51063",
            "operation": "add",
            "appliedOn": "2022-11-19T19:51:54.416Z",
            "status": "SUCCESS",
            "itemId": "8bc5bfec-c6a6-4b6f-95ec-5594e9d51063",
            "total": 5
        },
        {
            "referenceId": "5594e9d51063",
            "operation": "subtract_percentage",
            "appliedOn": "2022-11-19T19:36:35.828Z",
            "status": "SUCCESS",
            "itemId": "8bc5bfec-c6a6-4b6f-95ec-5594e9d51063",
            "percentage": 20
        }
    ],
    "_links": {
        "next": "/v1/merchant/item/events/referenced?start=4&limit=2&referenceId=5594e9d51063",
        "last": "/v1/merchant/item/events/referenced?start=4&limit=2&referenceId=5594e9d51063",
        "prev": "/v1/merchant/item/events/referenced?start=0&limit=2&referenceId=5594e9d51063",
        "first": "/v1/merchant/item/events/referenced?start=0&limit=2&referenceId=5594e9d51063"
    }
}
```

`limit` - the applied limit to the queried elements.

`size` - how many items are being returned as part of the page.

`start` - index at which the queried was performed in the events.

`total` - how many processed events are associated to the specified reference id.

`results` - the list of events associated to this page.

- `referenceId` - the value used to reference the event.
- `operation` - the applied operation specified on the event.
- `appliedOn` - date time when the event was applied, expressed in ISO 8601 format.
- `status` - which was the result of processing the event. The only possible values are: SUCCESS | FAILED
  - SUCCESS means the event was processed with no issues and the total associated to the item was modified as expected.
  - FAILED means the API encountered an error while applying the event and the operation could not be performed.
- `itemId` - the item for which the event was applied.
- `total` - value submitted in the event to be applied to the item.
- `percentage` - percentage submitted in the event to be applied to the item.

`_links` - contains the calculated links to the pages that you could query next based on the start and limit combinations that you sent in the request and the total items found for the referenceId. The links are optional and will not be calculated if there are no elements to be queried.

- `next` - calculated link for next page.
- `last` - calculated link for last page.
- `prev` - calculated link for previous page.
- `first` - calculated link for first page.

<br/>

<a name="get-item-events">

  ## Get Item Events
</a>

Paginated endpoint that provides the recorded and applied events associated with the specified item.

The paginated events will be returned order by date in which they were applied, with the most recent listed first and the least recent listed last.
<br/>
<br/>

`Request`

```
POST /v1/merchant/item/events?start=0&limit=20

{
    "itemId":"8bc5bfec-c6a6-4b6f-95ec-5594e9d51063"
}
```

`itemId` - unique key that is associated with the data.

- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

`start` - optional value to specify from which index do you wish to start the page to be queried.

- If not specified, a value of 0 will be used as default.

`limit` - optional value to specify how many items should be queried from the start index value.

- If not specified, a value of 20 will be used as default.
- Min accepted value is 1 and max accepted value will be 30.

<br/>

`Response`

```
Http 200

{
    "limit": 2,
    "size": 2,
    "start": 2,
    "total": 6,
    "results": [
        {
            "referenceId": "5594e9d51063",
            "operation": "subtract_percentage",
            "appliedOn": "2022-11-19T19:33:44.189Z",
            "status": "SUCCESS",
            "itemId": "8bc5bfec-c6a6-4b6f-95ec-5594e9d51063",
            "percentage": 20
        },
        {
            "operation": "add",
            "appliedOn": "2022-11-19T19:33:13.125Z",
            "status": "SUCCESS",
            "itemId": "8bc5bfec-c6a6-4b6f-95ec-5594e9d51063",
            "total": 100
        },
    ],
    "_links": {
        "next": "/v1/merchant/item/events?start=4&limit=2",
        "last": "/v1/merchant/item/events?start=4&limit=2",
        "prev": "/v1/merchant/item/events?start=0&limit=2",
        "first": "/v1/merchant/item/events?start=0&limit=2"
    }
}
```

`limit` - the applied limit to the queried elements.

`size` - how many items are being returned as part of the page.

`start` - index at which the queried was performed in the events.

`total` - how many processed events are associated to the specified reference id.

`results` - the list of events associated to this page.

- `referenceId` - the value used to reference the event. This value can be optional.
- `operation` - the applied operation specified on the event.
- `appliedOn` - date time when the event was applied, expressed in ISO 8601 format.
- `status` - which was the result of processing the event. The only possible values are: SUCCESS | FAILED
  - SUCCESS means the event was processed with no issues and the total associated to the item was modified as expected.
  - FAILED means the API encountered an error while applying the event and the operation could not be performed.
- `itemId` - the item for which the event was applied.
- `total` - value submitted in the event to be applied to the item.
- `percentage` - percentage submitted in the event to be applied to the item.

`_links` - contains the calculated links to the pages that you could query next based on the start and limit combinations that you sent in the request and the total items found for the referenceId. The links are optional and will not be calculated if there are no elements to be queried.

- `next` - calculated link for next page.
- `last` - calculated link for last page.
- `prev` - calculated link for previous page.
- `first` - calculated link for first page.

<br/>

<a name="delete-item">

  ## Delete Item
</a>

It will submit a request for the API to delete the current data on the desired item.

Keep in mind a couple of things.

This will not delete the events associated to the item. So, if you need to query those in the future, you can still do it.

Also, if you submit a new event for the itemId that you just deleted, the item will be created again, using the new value you submit.

<br/>
<br/>

`Request`

```
POST /v1/merchant/item/delete

{
    "itemId":"8bc5bfec-c6a6-4b6f-95ec-5594e9d51063"
}
```

`itemId` - unique key that is associated with the data.

- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

<br/>

`Response`

```
Http 204
```

<br/>

<a name="export-items">

  ## Export Items
</a>

You can have all your items exported into a CSV file and download it if you need to have access to all the data you are holding in the items.

For this, it must be done in 3 steps:
  - Initialize the export.
  - Check the status of the export process.
  - Download the generated CSV file holding the items.

Depending on how many items you are holding, it might take a bit to process the entire datastore. Remember to check for the status of the process to download the results as soon as they are ready.

<br/>

`Initialize Export - Request`

```
POST /v1/merchant/export/items/init
```
This will trigger the export process which are performed one at a time.

`Initialize Export - Response`

```
Http 200

{
    "id": "ec45ddfd-0047-4b1f-aca2-2a4767559930",
    "expiresAt": "2022-11-21T00:29:59.665Z"
}
```

`id` - a  unique identifier that is given to the export process. You will use it for everything related to this export, from checking the status, to downloading the results.

`expiresAt` - an expiration time expressed in ISO 8601 format, at which the process will be considered as expired because it could not be picked to process by any worker of the API. If this happens, you can submit another request as soon as you wish.

If there is an export that has been triggered already, you will received an `Http 429` as a response.

<br/>

`Check Export Status - Request`

```
GET /v1/merchant/export/items/status?id=ec45ddfd-0047-4b1f-aca2-2a4767559930
```

`id` - a  unique identifier that was provided in the response of the export initialization endpoint. You will use it for everything related to the export, from checking the status, to downloading the results.

`Check Export Status - Response`

```
{
    "id": "ec45ddfd-0047-4b1f-aca2-2a4767559930",
    "status": "COMPLETED"
}
```
`id` - the id sent as part of the request.

`status` - the recorded status for the ongoing export. The possible values are:
- COMPLETED - the export process finished with no issues at all and the file is available for download.
- COMPLETED_WITH_ERRORS - the export process finished but the API encountered some issues while processing the events.
- PENDING - the export was initialized but it still pending from a worker to pick it up.
- EXPIRED - no worker was able to pick up the export request, so the export process can be considered as expired and you can start a ne one.
- FAILED - the export failed completely and could not be finished.

<br/>

`Export Items Content - Request`

This endpoint will return you the content of the generated CSV file holding all the items and their data, found at the moment of the export was processed.

```
GET /v1/merchant/export/items/content?id=ec45ddfd-0047-4b1f-aca2-2a4767559930
```
`id` - a  unique identifier that was provided in the response of the export initialization endpoint. You will use it for everything related to the export, from checking the status, to downloading the results.

`Export Items Content - Response`
```
item_id,total,created_on,last_updated_on
8bc5bfec-c6a6-4b6f-95ec-5594e9d51063,80,2022-11-19T19:34:40.034Z,2022-11-19T22:01:24.537Z
```
The CSV file generated will hold the following columns:

`item_id` - unique key that is associated with the data.

`total` - the numeric value of the item.

`created_on` - date time when the item was created, expressed in ISO 8601 format.

`last_updated_on` - date time when the item was last modified, expressed in ISO 8601 format.

<br/>

<a name="import-items-events">

  ## Import Items Events
</a>

You can import a CSV file holding data for items you wish to upload to the API. The benefit of this feature, is that you don't have submit one request for each event you want to represent in the API, but a bunch of them at the same time using this import.

In order to upload an import of events, you go through 4 steps:
  - Initialize the import.
  - Upload the CSV file containing the events.
  - Check the status of the import process.
  - Download the results file, if one was generated.

Each file to be uploaded, cannot be bigger than 100 Megabytes and it must comply with a very specific format.

The headers of the CSV file must have the following columns declared:
  - item_id
  - operation
  - reference_id
  - total
  - percentage
  - comment

Each header must be present or the validation process will fail. Each value must be properly placed under the corresponding column, so the API can detect them properly.

`item_id` - unique key that is associated with the data.

- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

`operation` - which action you wish to perform over the item's total

- set - it sets the specified value as the item's total.
- add - it adds the specified amount to the item.
- subtract - it reduces the specified amount from the item.
- add_percentage - it increases the item's total by the specified percentage.
- subtract_percentage - it reduces the item's total by the specified percentage.

`total` - the numeric value to be used for the operation.

- must be a number between 0 and 999999999999, with up to 5 decimal places.

`percentage` - the percentage value to be used for the operation.

- must be a number between 0 and 999999999999, with up to 5 decimal places.

`reference_id` - this can be used to associate the event you are submitting to the API with anything you wish. The value doesn't need to be a unique key and can be used with other events to link them together.

- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

`comment` - any comment you deem relevant.

- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

<br/>

`Initialize Import - Request`

```
POST /v1/merchant/import/items/events/init
```
This will trigger the import process which are performed one at a time.

`Initialize Import - Response`

```
Http 200

{
    "id": "1c568229-cba6-4047-b6d1-76cab42f3aeb",
    "expiresAt": "2022-11-21T00:29:59.665Z"
}
```

`id` - a  unique identifier that is given to the import process. You will use it for everything related to this import, from checking the status, to downloading the results.

`expiresAt` - an expiration time expressed in ISO 8601 format, at which the process will be considered as expired because the import file was not properly uploaded to the API.

If there is an import that has been triggered already, you will received an `Http 429` as a response.

The import will be considered as expired after that and you will be able to start a new one if you want so.

<br/>

`Upload Import File - Request`

```
POST /v1/merchant/import/items/events/upload-file?id=1c568229-cba6-4047-b6d1-76cab42f3aeb

Content-Type = multipart/form-data

Body
file = <path/to/CSV/file>
```

`id` - a  unique identifier that was provided in the response of the export initialization endpoint. You will use it for everything related to the export, from checking the status, to downloading the results.

`Upload Import File - Response`

```
Http 204
```

<br/>

`Check Import Status - Request`

```
GET /v1/merchant/import/items/events/status?id=1c568229-cba6-4047-b6d1-76cab42f3aeb
```

`id` - a  unique identifier that was provided in the response of the import initialization endpoint. You will use it for everything related to the import, from checking the status, to downloading the results.

`Check Import Status - Response`

```
Http 200

{
    "id": "1c568229-cba6-4047-b6d1-76cab42f3aeb",
    "status": "COMPLETED"
}
```
`id` - the id sent as part of the request.

`status` - the recorded status for the ongoing import. The possible values are:
- COMPLETED - the import process finished with no issues at all and all the events were applied to the items.
- COMPLETED_WITH_ERRORS - the import process finished but the API encountered some issues with some events when processing them.
- WAITING_FOR_FILE - the import was initialized but the CSV file has not been uploaded yet.
- PENDING - the import file was uploaded with no issues and is waiting for a worker to pick it up and process it.
- IN_PROGRESS - the uploaded CSV file is being processed.
- EXPIRED - the CSV file was not uploaded and the request to process it reached the expiration time.
- FAILED - the import failed completely and could not be finished.

<br/>

`Import File Check Results File - Request`

If the status on the import process was COMPLETED_WITH_ERRORS then you can download a CSV file that specifies the row number of the import file you uploaded, and has the specified error on the events that failed.

```
GET /v1/merchant/import/items/events/results?id=64283212-c791-43da-a9ed-8ea26fd87510
```

`id` - the id sent as part of the request.

`Import File Check Results File - Response`

```
Http 200

row_number,errors
1,total must not be less than 0 - total must not be greater than 999999999999 - total must be a number conforming to the specified constraints
```

`row_number` - holds the row that failed to be processed.

`errors` - the errors that were identified for the event specified on that row.

<br/>

<a name="get-client">

   ## Get Client
</a>

Returns the data for the associated identifier(s). You can send one of the identifiers that you see on the request's body sample or combinations of them. In the case of card information, you need to make sure that you send: last4, issuer, and expirationDate, together.
<br/>
<br/>
`Request`

```
POST /v1/merchant/client

BODY
{
    "clientId": "0ed27a6e-25c9-4c87-82be-37ca71586579", (Optional)
    "clientEmail": "test@test.com", (Optional)
    "clientPhoneNumber": "+12015550378", (Optional)
    "last4": "1234", (Optional)
    "issuer": "Visa", (Optional)
    "expirationDate": "12/2030" (Optional)
}
```

`clientId` - key represents the identifier that you which to fetch for.

- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

`clientEmail` - represents the email associated to the client you which to query for.

`clientPhoneNumber` - phone number you might have associated with the client data.

`last4` - last four digits of a credit card that might be associated with the client's data.

`issuer` - issuer organization that emited the credit card that might be associated with the client's data.
- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

`expirationDate` - expiration date of the credit card that might be associated with the client's data.
- must match one of the following patterns: MM/YY, MM/YYYY, MMYY, or MMYYYY

Remember that if you wish to use the data for the credit card as the way to identify the client, will have to send the `last4`, `issuer`, and `expirationDate` values combined.

<br/>

`Response`

```
Http 200

{
    "clientPhoneNumber": "+12015550378",
    "clientEmail": "test@test.com",
    "clientId": "0ed27a6e-25c9-4c87-82be-37ca71586579",
    "paymentMethods": [
        {
            "last4": "1234",
            "issuer": "Visa",
            "expirationDate": "12/2030"
        }
    ],
    "total": 100,
    "createdOn": "2022-11-23T20:02:24.755Z",
    "lastUpdatedOn": "2022-11-23T20:02:24.755Z"
}
```

<br/>

`clientId` - unique key that is associated with the data.

`total` - the numeric value of the item.

`clientEmail` - represents the email associated to the client you which to query for.

`clientPhoneNumber` - phone number you might have associated with the client data.

`paymentMethods` - an array of payment methods that you have associated the client with. You can use one of the payment methods to find the client data.

`createdOn` - date time when the client was created, expressed in ISO 8601 format.

`lastUpdatedOn` - date time when the client was last modified, expressed in ISO 8601 format.

<br/>

Post Client Event

<a name="post-client">

   ## Post Client Event
</a>

Submits an event to be applied to the client's total. If the client does not exist, it creates it.

One important thing.

You can submit a combination of the identifiers available for the client data. If you send the values for a credit card: last4, issuer, and expirationDate, these will be added to the client's list of payment methods as long as you use another identifier for the client.

If you send a payment method with no other identifier, the API will create a new client because it has no way to tie it up to the client you wish. You could also send an event with the same payment method and another identifier event after the client already exist, this way, the client generated with the payment method will be updated with the identifier for other future operations.

`Keep in mind that if you send identifiers for a client and later you add a new one, the client's data will be updated to include the new identifier.`

`If you send an identifier that is used in another client, the event will fail to be applied properly.`

`If you send multiple identifiers, but one of them has a new value, then it will be updated in the client's data, as long as it is not found in any other client.`

<br/>

`Request`

```
POST /v1/merchant/client/events/post

BODY - Option 1
{
    "operation": "set",
    "total": 100,
    "clientPhoneNumber":"+12015550378",
    "clientEmail":"test@test.com",
    "clientId": "0ed27a6e-25c9-4c87-82be-37ca71586579",
    "last4":"1234",
    "issuer":"Visa",
    "expirationDate":"12/2030",
    "referenceId": "37ca71586579"
}

BODY - Option 2
{
    "operation": "add_percentage",
    "percentage": 100,
    "clientPhoneNumber":"+12015550378",
    "clientEmail":"test@test.com",
    "clientId": "0ed27a6e-25c9-4c87-82be-37ca71586579",
    "last4":"1234",
    "issuer":"Visa",
    "expirationDate":"12/2030",
    "referenceId": "37ca71586579"
}
```

`operation` - which action you wish to perform over the client's total
- set - it sets the specified value as the client's total.
- add - it adds the specified amount to the client.
- subtract - it reduces the specified amount from the client.
- add_percentage - it increases the client's total by the specified percentage.
- subtract_percentage - it reduces the client's total by the specified percentage.

`total` - the numeric value to be used for the operation.
- must be a number between 0 and 999999999999, with up to 5 decimal places.

`clientEmail` - represents the email associated to the client you which to query for.

`clientPhoneNumber` - phone number you might have associated with the client data.

`clientId` - unique key that is associated with the data.
- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

`percentage` - the percentage value to be used for the operation.

- must be a number between 0 and 999999999999, with up to 5 decimal places.

`referenceId` - this can be used to associate the event you are submitting to the API with anything you wish. The value doesn't need to be a unique key and can be used with other events to link them together.

- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

`comment` - any comment you deem relevant.

- value's length cannot be linger than 70 characters.
- value cannot have any of the following characters [`!$%&\*()/\\\=[]{};'"|,.<>?]

<br/>

`Response`

```
Http 204

This code will be returned when the event was submitted succesfully.
```

<br/>
<br/>

## Support

For issues that you face while using this API, you can open a case on my <a>GitHub page</a>. I'll address any questions, comments, suggestions, and issues, as fast as possible.

<br/>

## Stay in touch

I'm open to help you set up your own dedicated instance of marcador.io, administered and handled by me, just contact me on my email.

- Author - Arian Lopez
- Contact - arian.lopez@luyhub.com
