from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from pathlib import Path
import pymssql
import yaml

path = Path(__file__).parent / "config.yaml"
config = yaml.safe_load(open(path))

secret_config_path = Path(__file__).parent / "../secret_config.yaml"
secret_config = yaml.safe_load(open(secret_config_path))


def get_sqlalchemy_db_connection():
    db_uri = config["sqlalchemy_decoded_url"]
    db_connection_url = URL.create("mssql+pyodbc", query={"odbc_connect": db_uri})
    return create_engine(db_connection_url)


def get_pydapper_db_connection():
    import pydapper

    conn = pymssql.connect(
        config["server"],
        secret_config["app_user"],
        secret_config["app_user_password"],
        config["database"],
    )

    return pydapper.using(conn)


def clear_db():
    db = get_sqlalchemy_db_connection()
    with db.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
        conn.execute(
            text(
                """EXEC sp_MSforeachtable 'if ("?" NOT IN ("[dbo].[alembic_version]")) TRUNCATE TABLE ?'"""
            )
        )
