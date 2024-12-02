from azure.cosmos import CosmosClient, PartitionKey
import urllib3
from pathlib import Path
import yaml
import os
from api.persistence.run_cosmos import start_and_wait_for_cosmos

from api.persistence.constants import TASKS_LISTS_CONTAINER_ID, TASKS_LISTS_PARTITION_KEY_PATH

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
        id=TASKS_LISTS_CONTAINER_ID,
        partition_key=PartitionKey(
            path=TASKS_LISTS_PARTITION_KEY_PATH,
        ),
    )


def get_db_connection():
    return client.get_database_client(config["database"]).get_container_client(
        TASKS_LISTS_CONTAINER_ID
    )


def clear_db():
    client.delete_database(config["database"])
