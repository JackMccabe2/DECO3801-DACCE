import sys
import random
import time

# Simulate a terminal

def handle_command(command):
    if command == "scan":
        scan_network()
    elif command == "recon":
        perform_recon()
    elif command == "exit":
        exit_game()
    else:
        print("Unknown command. Type 'help' for available commands.")

# Print commands
from Firewall.firewall import scan_network, perform_recon, exploit_vulnerability, retrieve_data, reset_firewall

def handle_command(command):
    if command == "help":
        print("-- Available commands:")
        print("   scan      - Scan the network for open ports and IDS status")
        print("   recon     - Perform reconnaissance to discover vulnerabilities")
        print("   exploit   - Attempt to breach the firewall using known exploits")
        print("   retrieve  - Retrieve sensitive information from the firewall")
        print("   reset     - Reset the firewall to its default state")
        print("   exit      - Exit the game")
    elif command == "scan":
        scan_network()
    elif command == "recon":
        perform_recon()
    elif command == "exploit":
        exploit_vulnerability()
    elif command == "retrieve":
        retrieve_data()
    elif command == "reset":
        reset_firewall()
    else:
        print("Unknown command. Type 'help' for available commands.")

def exit_game():
    print("-- Exiting game...")
    time.sleep(1)
    sys.exit()

def main():
    print("-- Welcome to the QuantumHeist Terminal! Type 'help' for commands.")
    
    while True:
        command = input(">> ").strip().lower()
        handle_command(command)

if __name__ == "__main__":
    main()

