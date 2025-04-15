import sys
import random
import time

# Simulate a "terminal" command handler that the player interacts with

# This will handle the available commands and their functionality
def handle_command(command):
    if command == "scan":
        scan_network()
    elif command == "recon":
        perform_recon()
    elif command == "exit":
        exit_game()
    else:
        print("Unknown command. Type 'help' for available commands.")

# Print the available commands
def print_help():
    print("Available commands:")
    print("  scan - Scan the network for vulnerabilities")
    print("  recon - Perform reconnaissance on the firewall")
    print("  exit - Exit the game")
    print("  help - Show this help message")

# Simulate scanning for firewalls (randomly simulate success/failure)
def scan_network():
    print("-- Scanning network...")
    time.sleep(2)  # Simulate the delay of scanning
    result = random.choice(["Firewall detected!", "No firewall detected."])
    print(f"-- {result}")

# Simulate performing reconnaissance on the firewall
def perform_recon():
    print("-- Performing reconnaissance on the firewall...")
    time.sleep(3)  # Simulate a longer recon process
    recon_info = random.choice(["Weak password detected", "Encrypted traffic detected", "No vulnerabilities found"])
    print(f"-- Recon complete: {recon_info}")

# Simulate exiting the game
def exit_game():
    print("-- Exiting game...")
    time.sleep(1)
    sys.exit()

# Main loop to interact with the user
def main():
    print("-- Welcome to the QuantumHeist Terminal! Type 'help' for commands.")
    
    while True:
        command = input(">> ").strip().lower()
        if command == "help":
            print_help()
        else:
            handle_command(command)


if __name__ == "__main__":
    main()

