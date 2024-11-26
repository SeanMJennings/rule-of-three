from pathlib import Path
import requests
import urllib3
import yaml

urllib3.disable_warnings()
path = Path(__file__) / "../config.yaml"
config = yaml.safe_load(open(path))

the_url = config["url"]


def main() -> None:
    requests.get('https://' + the_url + '/api/keep-alive')
