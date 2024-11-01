#!/bin/bash

# Author: Oisin Aeonn

# Installation script for article generation and push tool
# This script installs required dependencies and sets up the article generation project

# Install git using yum package manager
# -y flag automatically answers yes to prompts
sudo yum install git -y

# Install Python3 boto library for AWS functionality
sudo yum install python3-boto

# Clone the article generation repository from GitHub
git clone https://github.com/laurencewatts3/The-Zone-Semester-2-WIL-Program

# Change directory into the project folder
cd data/database

# Execute the main Python script
# Note: Before running, ensure AWS credentials are properly configured
# and necessary permissions are set up
python3 push_to_dynamodb.py