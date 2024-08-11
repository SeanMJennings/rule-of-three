from azure.cosmos import CosmosClient, PartitionKey
import urllib3
from pathlib import Path
import yaml
from src.persistence.constants import CONTAINER_ID, PARTITIONKEYPATH

urllib3.disable_warnings()
path = Path(__file__).parent / "config.yaml"
config = yaml.safe_load(open(path))

secret_config_path = Path(__file__).parent / "../secret_config.yaml"
secret_config = yaml.safe_load(open(secret_config_path))

client = CosmosClient(
    url=config["url"],
    credential=(config["accountKey"]),
)


def setup_db():
    client.create_database_if_not_exists(config["database"])
    client.get_database_client(config["database"]).create_container_if_not_exists(
        id=CONTAINER_ID, partition_key=PartitionKey(
            path=PARTITIONKEYPATH,
        )
    )


def get_db_connection():
    return client.get_database_client(config["database"]).get_container_client(
        CONTAINER_ID
    )


def clear_db():
    client.delete_database(config["database"])
