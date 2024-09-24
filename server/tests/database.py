from azure.cosmos import CosmosClient, PartitionKey
import urllib3
from pathlib import Path
import yaml
import os
from tests.run_windows_cosmos import start_and_wait_for_cosmos

from src.persistence.constants import CONTAINER_ID, PARTITIONKEYPATH

urllib3.disable_warnings()
path = Path(__file__).parent / "config.yaml"
config = yaml.safe_load(open(path))

connection_string = config["connection_string"]

client = None
if os.name == "nt":
    client = start_and_wait_for_cosmos(connection_string)
else:
    client = CosmosClient.from_connection_string(connection_string)


def setup_db():
    client.create_database_if_not_exists(config["database"])
    client.get_database_client(config["database"]).create_container_if_not_exists(
        id=CONTAINER_ID,
        partition_key=PartitionKey(
            path=PARTITIONKEYPATH,
        ),
    )


def get_db_connection():
    return client.get_database_client(config["database"]).get_container_client(
        CONTAINER_ID
    )


def clear_db():
    client.delete_database(config["database"])
