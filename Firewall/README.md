Folder that stores all firewall program logic

To run firewall game run firewall.py into server

terminal.py Functionality:
- prompts user for input commands
- handles inputs and runs associated functions from firewall.py
- has prints for certain helper sections
- appropriately handles exit_game
- contains main file to run program/simulate game

firewall.py Functionality:
- Contains all functionality that is being called in terminal.py

Flow of game:
- Before recieving input game prints welcome message and randomly gens a firewall_configuration
- SCAN: The player starts by using scan to find active IPs
- The player then uses nmap to find programs runnning on the server
- RECON: player uses nmap --script vuln to find vulnerabilities on network programs
  and nikto -h to find vulns on web programs
- 