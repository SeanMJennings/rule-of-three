from azure.cosmos import CosmosClient, PartitionKey
from src.persistence.constants import CONTAINER_ID, PARTITIONKEYPATH
import urllib3
from pathlib import Path
import yaml

path = Path(__file__).parent / "../config.yaml"
config = yaml.safe_load(open(path))

urllib3.disable_warnings()


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
