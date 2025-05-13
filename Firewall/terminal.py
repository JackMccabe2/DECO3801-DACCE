import sys
import random
import time
from firewall import (
    scan_network,
    exploit_vulnerability,
    retrieve_data,
    reset_firewall,
    nmap_scan,
    nmap_vuln,
    run_nikto,
    run_whatweb,
    exploit_freak,
    exploit_logjam,
    exploit_poodle,
    generate_firewall_config,
    exploit_wp_rce,
    exploit_django_ssti,
    print_vulns,
    # and the global config object we’ll overwrite:
    firewall_config
)

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
        print("   whatweb <ip>             → Fingerprint web technologies")
    elif command == "help nikto":
        print("-- Nikto scan usage:")
        print("   → Scan web server for common misconfigurations")
        print("   nikto -h <host>               # scan default HTTP port 80")
        print("   nikto -h <host> -p <port>     # scan the given port (e.g. HTTPS on 443)")
        print("   nikto <host> <port>           # shorthand: host followed by port")
        print()
        print("   Examples:")
        print("     nikto -h 10.0.0.1")
        print("     nikto -h 10.0.0.1 -p 443")
        print("     nikto 10.0.0.1 8080")
    elif command == "scan":
        scan_network()
    elif command == "print vulns":
        print_vulns()   
    elif command.startswith("nmap --script vuln"):
        nmap_vuln(command)
    elif command.startswith("nmap "):
        nmap_scan(command)
    elif command.startswith("nikto"):
        run_nikto(command)
    elif command == "exploit":
        exploit_vulnerability()
    elif command == "retrieve":
        retrieve_data()
    elif command.startswith("exploit_wp_rce"):
        exploit_wp_rce(command)
    elif command == "exploit_django_ssti":
        exploit_django_ssti(command)
    elif command.startswith("exploit poodle"):
        ip = command.split()[-1]
        exploit_poodle(ip)
    elif command.startswith("exploit freak"):
        ip = command.split()[-1]
        exploit_freak(ip)
    elif command.startswith("exploit logjam"):
        ip = command.split()[-1]
        exploit_logjam(ip)
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
    new_cfg = generate_firewall_config() 
    firewall_config.clear()
    firewall_config.update(new_cfg)

    while True:
        command = input(">> ").strip().lower()
        handle_command(command)

if __name__ == "__main__":
    main()

