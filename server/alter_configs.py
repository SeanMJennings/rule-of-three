import configparser
from pathlib import Path
import yaml

secret_config_path = Path(__file__).parent / "secret_config.yaml"
secret_config = yaml.safe_load(open(secret_config_path))

config = configparser.ConfigParser()
config.read("alembic.ini")

config["alembic"][
    "sqlalchemy.url"
] = f"mssql+pyodbc://?odbc_connect=DRIVER%%3DODBC+Driver+17+for+SQL+Server%%3BSERVER%%3Dlocalhost%%3BDATABASE%%3Druleofthree%%3BUID%%3D{secret_config['migration_user']}%%3BPWD%%3D{secret_config['migration_user_password_encoded']}"

config["alembic_setup"]["sqlalchemy.decoded_url"] = f"DRIVER=ODBC Driver 17 for SQL Server;SERVER=localhost;DATABASE=ruleofthree;UID={secret_config['migration_user']};PWD={secret_config['migration_user_password']}"

with open("alembic.ini", "w") as configfile:
    config.write(configfile)

test_config_path = Path(__file__).parent / "tests/config.yaml"
test_config = yaml.safe_load(open(test_config_path))
test_config["sqlalchemy_decoded_url"] = f"DRIVER=ODBC Driver 17 for SQL Server;SERVER=localhost;DATABASE=ruleofthree;UID={secret_config['migration_user']};PWD={secret_config['migration_user_password']}"

with open("tests/config.yaml", "w") as test_config_file:
    yaml.dump(test_config, test_config_file)
