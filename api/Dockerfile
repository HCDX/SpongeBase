FROM python:2.7-alpine
ADD . /todo
WORKDIR /todo
RUN pip install -r requirements.txt

## cron ##

# Add crontab file in the cron directory
## ADD crontab /etc/cron.d/hello-cron

# Give execution rights on the cron job
## RUN chmod 0644 /etc/cron.d/hello-cron

# Create the log file to be able to run tail
## RUN touch /var/log/cron.log

# # Run the command on container startup
# CMD cron && tail -f /var/log/cron.log
