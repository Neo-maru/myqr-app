import logging

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(message)s",
)

logger = logging.getLogger("app")


def log_debug(title: str, data) -> None:
    logger.info(f"{title}: {data}")
