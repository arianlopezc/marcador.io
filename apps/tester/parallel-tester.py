from argparse import ArgumentParser
import requests
import uuid
import random
import threading

TOTAL_EVENTS_IN_CYCLE = 10


class Event:
    def __init__(self, item_id, operation, total):
        self.id = item_id
        self.operation = operation
        self.total = total


class TestThread(threading.Thread):
    def __init__(self, threadID, total_items_to_test, total_requests_to_test):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.total_items_to_test = total_items_to_test
        self.total_requests_to_test = total_requests_to_test
        self.total_mismatchs = 0
        self.total_errors = 0

    def run(self):
        print(f'Starting Thread: {str(self.threadID)}')
        print(f'Thread {str(self.threadID)} Calling perform_test')
        [total_mismatchs, total_successful_requests, total_errors] = perform_test(
            self.total_items_to_test, self.total_requests_to_test)
        self.total_mismatchs = total_mismatchs
        self.total_successful_requests = total_successful_requests
        self.total_errors = total_errors


threads = []

parser = ArgumentParser()
parser.add_argument("-i", "--items", dest="total_items",
                    help="total items to generate events for", default=5)

parser.add_argument("-t", "--threads", dest="total_threads",
                    help="total threads to launch", default=5)

parser.add_argument("-r", "--requests", dest="total_requests",
                    help="total requests with random arithmetic operations to be submitted", default=100)

args = parser.parse_args()

total_items = int(args.total_items)
total_requests = int(args.total_requests)
total_threads = int(args.total_threads)

print("Starting Sequential Tester")
print()

operations = ["add", "subtract", "set"]

print(f'Generating {str(total_requests)} events for {str(total_items)} items')

total_mismatch_reported = 0
total_successful_requests_reported = 0
total_errors_reported = 0


def check_events(ids_to_check, expected_results):
    total_mismatch = 0
    total_errors = 0
    for id in ids_to_check:
        try:
            response = requests.get("http://localhost:3000/v1/item?id=%s" % id)
            if response.status_code == 204:
                total_mismatch += 1
            elif response.status_code == 200:
                item = response.json()
                if item["total"] != expected_results[id]:
                    total_mismatch += 1
            else:
                total_errors += 1
                print("Error getting item: %s", response.text)
        except Exception as e:
            print("Error getting item: {id}")
            print(e)
    return [total_mismatch, total_errors]


def perform_test(total_items_to_test, total_requests_to_test):
    item_ids = [str(uuid.uuid4())
                for client_number in range(int(total_items_to_test))]
    expected_results = {}
    event_index = 0
    total_successful_requests = 0
    total_mismatchs = 0
    total_errors = 0

    for i in range(total_requests_to_test):
        if TOTAL_EVENTS_IN_CYCLE == event_index:
            event_index = 0
            [total_mismatch, total_error] = check_events(
                list(expected_results.keys()), expected_results)
            total_mismatchs += total_mismatch
            total_errors += total_error

        item_id = random.choice(item_ids)
        operation = random.choice(operations)
        total = random.randint(0, 200)
        event = Event(item_id, operation, total)
        try:
            response = requests.put(
                "http://localhost:3000/v1/item", json=event.__dict__)
            if response.status_code != 204:
                print("Error submitting event: %s", response.text)
            else:
                total_successful_requests += 1
                if item_id not in expected_results:
                    expected_results[item_id] = 0
                if operation == "add":
                    expected_results[item_id] += total
                elif operation == "subtract":
                    expected_results[item_id] -= total
                elif operation == "set":
                    expected_results[item_id] = total
        except Exception as e:
            print("Error submitting event: %s", e)
        event_index += 1

    [total_mismatch, total_error] = check_events(
        list(expected_results.keys()), expected_results)
    total_mismatchs += total_mismatch
    total_errors += total_error

    return [total_mismatchs, total_successful_requests, total_errors]


for thread_number in range(total_threads):
    try:
        new_thread = TestThread(thread_number, total_items, total_requests)
        new_thread.start()
        threads.append(new_thread)
    except Exception as e:
        print("Error: unable to start thread")
        print(e)

for t in threads:
    t.join()

for t in threads:
    total_mismatch_reported += t.total_mismatchs
    total_successful_requests_reported += t.total_successful_requests
    total_errors_reported += t.total_errors

print()
print("Results:")
print(f'Total items: {total_items * total_threads}')
print(f'Total successful requests: {total_successful_requests_reported}')
print(f'Total mismatches: {total_mismatch_reported}')
print(f'Total errors: {total_errors_reported}')
print(
    f'Percentage of mismatches: {(total_mismatch_reported / total_successful_requests_reported * 100)}')
print()
print("Test is Finished")

print()
