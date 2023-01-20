<br/>
<h1 align="center">
  marcador.io
</h1>
<br/>
<br/>

## How to run the service?

<br/>

### Clone the service from GitHub.

```
git@github.com:arianlopezc/marcador.git
```

<br/>

```
cd into the folder
```

<br/>

### Run Docker Composer.

```
docker-compose up
```

<br/>

<br/>

## How to run the tests?

<br/>

### Make sure you have Python3 installed.

<br/>

### Go to the test folder under:
```
cd ./apps/tester
```

### Now run the tester script.
```
python3 parallel-tester.py 
```

<p>
You can specify how you want the test to run.
</p>

```
python3 parallel-tester.py --items 5 --threads 5 --requests 100

--items (total items to use per running test)
--threads (total threads the script should run sending requests to the API)
--requests (how many requests do you wish the script sends from each thread)
```