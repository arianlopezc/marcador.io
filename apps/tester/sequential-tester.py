from argparse import ArgumentParser
import requests
import uuid
import random
import datetime

class Event:
    def __init__(self, item_id, operation, total):
        self.id = item_id
        self.operation = operation
        self.total = total


parser = ArgumentParser()
parser.add_argument("-i", "--items", dest="total_items",
                    help="total items to generate events for", default="5")

parser.add_argument("-r", "--requests", dest="total_requests",
                    help="total requests with random arithmetic operations to be submitted", default=100)

args = parser.parse_args()

total_items = int(args.total_items)
total_requests = int(args.total_requests)

print("Starting Sequential Tester")
print()

item_ids = [str(uuid.uuid4()) for client_number in range(int(total_items))]
operations = ["add", "subtract", "set"]
events_to_submit = []
expected_results = {}

print("Generating %d events for %d items".format(total_requests, total_items))
print()

for i in range(total_requests):
    item_id = random.choice(item_ids)
    operation = random.choice(operations)
    total = random.randint(0, 200)
    events_to_submit.append(Event(item_id, operation, total))
    if item_id not in expected_results:
        expected_results[item_id] = 0
    if operation == "add":
        expected_results[item_id] += total
    elif operation == "subtract":
        expected_results[item_id] -= total
    elif operation == "set":
        expected_results[item_id] = total

print("Submitting requests to the API")
print()

total_successful_requests = 0

start_submit_time = datetime.datetime.now()
for event in events_to_submit:
    try:
        response = requests.put(
            "http://localhost:3000/v1/item", json=event.__dict__)
        if response.status_code != 204:
            print("Error submitting event: %s", response.text)
        else:
            total_successful_requests += 1
    except Exception as e:
        print("Error submitting event: %s", e)
end_submit_time = datetime.datetime.now()

print("All events were submitted")
print("Getting results from the API")
print()

total_mismatch = 0
start_check_time = datetime.datetime.now()
for id in item_ids:
    try:
        response = requests.get("http://localhost:3000/v1/item?id=%s" % id)
        if response.status_code != 200:
            print("Error getting item: %s", response.text)
        else:
            item = response.json()
            if item["total"] != expected_results[id]:
                total_mismatch += 1
    except Exception as e:
        print("Error getting item: %s", e)

end_check_time = datetime.datetime.now()

print()
print("Results:")
print("Total items: %d" % total_items)
print("Total successful requests: %d" % total_successful_requests)
print("Total mismatches: %d" % total_mismatch)
print("Percentage of mismatches: %f" % (total_mismatch / total_items * 100))
print("Total milliseconds it took to submit: %d" % ((end_submit_time - start_submit_time).total_seconds() * 1000))
print("Total milliseconds it took to check: %d" % ((end_check_time - start_check_time).total_seconds() * 1000))
print()
print("Test is Finished")
