import subprocess
from functools import partial
from azure.core.exceptions import ServiceRequestError
from azure.cosmos import CosmosClient

from tenacity import retry, stop_after_delay, wait_fixed, retry_if_exception_type

retry_on_service_request_error = partial(
    retry,
    stop=stop_after_delay(300),
    wait=wait_fixed(5),
    retry=retry_if_exception_type(ServiceRequestError),
)()


def start_and_wait_for_cosmos(connection_string):
    programs = str(subprocess.check_output("tasklist"))
    if "Microsoft.Azure.Cosmos" not in programs:
        subprocess.run("start /B Microsoft.Azure.Cosmos.Emulator.exe", shell=True)
    return __connect_to_cosmos(connection_string)


@retry_on_service_request_error
def __connect_to_cosmos(connection_string):
    return CosmosClient.from_connection_string(connection_string)
