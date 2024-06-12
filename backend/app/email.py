import smtplib
import os
from os.path import basename
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
from typing import Union, List
import time
from dotenv import load_dotenv


load_dotenv()

smtp_server = os.environ.get("EMAIL_HOST")
smtp_port = os.environ.get("EMAIL_PORT")
smtp_username = os.environ.get("EMAIL_USERNAME")
smpt_password = os.environ.get("EMAIL_PASSWORD")
sender_email = os.environ.get("EMAIL_SENDER")


def send_mail(
    reciever: Union[str, list],
    subject: str,
    content: str,
    attachments: List[str] | None = None,
    sender: str = sender_email,
) -> None:
    # Create message container - the correct MIME type is multipart/alternative.
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender
    if isinstance(reciever, str):
        msg["To"] = reciever
    elif isinstance(reciever, list):
        rec_list = [r for r in reciever if r is not None and len(r) > 0]
        reciever = rec_list
        msg["To"] = ", ".join(rec_list)
    else:
        return
    msg["Bcc"] = ""

    part1 = MIMEText(content, "html")
    msg.attach(part1)

    if attachments:
        for f in attachments:
            f = f.rsplit("/", 1)[-1]
            f = os.path.join("uploaded_files", f)
            if not os.path.exists(f):
                continue
            with open(f, "rb") as fil:
                part = MIMEApplication(fil.read(), Name=basename(f))
            part["Content-Disposition"] = 'attachment; filename="%s"' % basename(f)
            msg.attach(part)

    with smtplib.SMTP(smtp_server, int(smtp_port)) as server:
        if len(smtp_username) > 0:
            server.login(smtp_username, smpt_password)
            print("server login")
        server.sendmail(sender_email, reciever, msg.as_string())


def send_mails(send_info: List) -> None:
    for info in send_info:
        time.sleep(0.1)
        reciever = info.get("reciever", None)
        subject = info.get("subject", "")
        content = info.get("content", "")
        attachments = info.get("attachments", [])

        if not reciever:
            continue

        # Create message container - the correct MIME type is multipart/alternative.
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = sender_email
        if isinstance(reciever, str):
            msg["To"] = reciever
        elif isinstance(reciever, list):
            rec_list = [r for r in reciever if r is not None and len(r) > 0]
            reciever = rec_list
            msg["To"] = ", ".join(rec_list)
        else:
            return
        msg["Bcc"] = ""

        part1 = MIMEText(content, "html")
        msg.attach(part1)

        for f in attachments:
            f = f.rsplit("/", 1)[-1]
            f = os.path.join("uploaded_files", f)
            if not os.path.exists(f):
                continue
            with open(f, "rb") as fil:
                part = MIMEApplication(fil.read(), Name=basename(f))
            part["Content-Disposition"] = 'attachment; filename="%s"' % basename(f)
            msg.attach(part)

        with smtplib.SMTP(smtp_server, int(smtp_port)) as server:
            if len(smtp_username) > 0:
                server.login(smtp_username, smpt_password)
            server.sendmail(sender_email, reciever, msg.as_string())
