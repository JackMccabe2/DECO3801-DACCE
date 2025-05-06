import sys
import random
import time

# Print commands
from firewall import scan_network, exploit_vulnerability, retrieve_data, reset_firewall, nmap_scan, vuln_scan, run_nikto, run_whatweb

def handle_command(command):
    if command == "help":
        print("-- Available commands:")
        print("   scan      - Scan the network for active IP addresses")
        print("   nmap      - Run a simulated Nmap scan (e.g. `nmap -sV 10.0.0.1`)")
        print("   help recon     - Commands for performing reconnaissance to discover vulnerabilities")
        print("   exploit   - Attempt to breach the firewall using known exploits")
        print("   retrieve  - Retrieve sensitive information from the firewall")
        print("   reset     - Reset the firewall to its default state")
        print("   exit      - Exit the game")
    elif command == "help recon":
        print("   nmap --script vuln <ip>  → Scan for known vulnerabilities")
        print("   nikto -h <ip>            → Scan web server for common misconfigurations")
        print("   whatweb <ip>             → Fingerprint web technologies")
    elif command.startswith("nmap --script vuln"):
        vuln_scan(command)
    elif command.startswith("nmap "):
        nmap_scan(command)
    elif command == "scan":
        scan_network()
    elif command.startswith("nikto"):
        run_nikto(command)
    elif command.startswith("whatweb"):
        run_whatweb(command)
    elif command == "exploit":
        exploit_vulnerability()
    elif command == "retrieve":
        retrieve_data()
    elif command == "reset":
        reset_firewall()
    elif command == "exit":
        exit_game()
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

