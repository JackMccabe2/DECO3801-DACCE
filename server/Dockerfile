FROM node:18

# Install Python, pip, and venv dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv

# Create a virtual environment for Python
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python packages inside the virtual environment
RUN pip install torch numpy psycopg2-binary

# Set working directory
WORKDIR /app

# Copy app files
COPY . .

# Install Node dependencies
RUN npm install

EXPOSE 8080

# Start server
CMD ["npm", "start"]