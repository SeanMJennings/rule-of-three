from pathlib import Path

import azure.functions as func
import requests
import urllib3
import yaml

urllib3.disable_warnings()
path = Path(__file__).parent / "config.yaml"
config = yaml.safe_load(open(path))

the_url = config["url"]

app = func.FunctionApp()


@app.function_name(name="keep_alive_timer")
@app.schedule(schedule="0 */5 * * * *", arg_name="keep_alive_timer", run_on_startup=False,
              use_monitor=False)
def keep_alive() -> None:
    requests.get('https://' + the_url + '/api/keep-alive')
