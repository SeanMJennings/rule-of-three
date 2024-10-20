from azure.cosmos import CosmosClient, PartitionKey
from src.persistence.constants import CONTAINER_ID, PARTITIONKEYPATH
import urllib3
from pathlib import Path
import yaml
from src.persistence.run_windows_cosmos import start_and_wait_for_cosmos

path = Path(__file__).parent / "../config.yaml"
config = yaml.safe_load(open(path))

urllib3.disable_warnings()

start_and_wait_for_cosmos(config["connection_string"])
client = CosmosClient.from_connection_string(config["connection_string"])

database = client.create_database_if_not_exists(
    id=config["database"],
    offer_throughput=400,
)

container = database.create_container_if_not_exists(
    id=CONTAINER_ID,
    partition_key=PartitionKey(
        path=PARTITIONKEYPATH,
    ),
)
