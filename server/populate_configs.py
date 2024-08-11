from pathlib import Path
import yaml

secret_config_path = Path(__file__).parent / "secret_config.yaml"
secret_config = yaml.safe_load(open(secret_config_path))

src_config_path = Path(__file__).parent / "src/config.yaml"
src_config = yaml.safe_load(open(src_config_path))
src_config["url"] = secret_config['url']
src_config["accountKey"] = secret_config['accountKey']
src_config["database"] = secret_config['database']


with open("src/config.yaml", "w") as test_config_file:
    yaml.dump(src_config, test_config_file)

test_config_path = Path(__file__).parent / "tests/config.yaml"
test_config = yaml.safe_load(open(test_config_path))
src_config["url"] = secret_config['url']
src_config["accountKey"] = secret_config['accountKey']
src_config["database"] = secret_config['database']

with open("tests/config.yaml", "w") as test_config_file:
    yaml.dump(test_config, test_config_file)
