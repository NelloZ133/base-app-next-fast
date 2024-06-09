import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from utils.logger import get_logger


logger = get_logger(__name__)

scheduler = AsyncIOScheduler()


def main():
    logger.info("Starting scheduler")
    # scheduler.add_job(func, "interval", minutes=30)
    scheduler.start()


if __name__ == "__main__":
    main()
    try:
        asyncio.get_event_loop().run_forever()
    except (KeyboardInterrupt, SystemExit):
        pass
    finally:
        scheduler.shutdown()
