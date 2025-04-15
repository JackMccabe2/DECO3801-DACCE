### main.py
from Firewall.terminal import handle_command
from modules.game_state import GameState


def main():
    print("Welcome to QuantumHeist v1.0")
    print("-- Target system detected: firewallcorp.ai")
    print("-- Objective: Retrieve internal flag behind adaptive firewall.")
    print("Type 'help' for a list of commands.\n")

    game = GameState()

    while not game.finished:
        try:
            command = input("QuantumHeist> ")
            handle_command(command, game)
        except KeyboardInterrupt:
            print("\n[-] Session terminated.")
            break


if __name__ == "__main__":
    main()


### terminal.py
from modules import recon, scanner, enumerator, exploiter

def handle_command(cmd, game):
    args = cmd.strip().split()
    if not args:
        return

    command = args[0]
    if command == "help":
        print("""
Available commands:
  recon [target]
  scan --target <ip> [--stealth]
  enum --target <ip:port>
  exploit --target <ip:port> --payload <file>
  inject --payload <file> [--bypass]
  tunnel --protocol <type>
  shell
  exit
""")
    elif command == "recon":
        recon.run(game, args[1:])
    elif command == "scan":
        scanner.run(game, args[1:])
    elif command == "enum":
        enumerator.run(game, args[1:])
    elif command == "exploit":
        exploiter.run(game, args[1:])
    elif command == "inject":
        exploiter.inject(game, args[1:])
    elif command == "tunnel":
        exploiter.tunnel(game, args[1:])
    elif command == "shell":
        exploiter.shell(game)
    elif command == "exit":
        game.finished = True
        print("-- Exiting QuantumHeist...")
    else:
        print("[-] Unknown command. Try 'help'.")


### modules/game_state.py
class GameState:
    def __init__(self):
        self.finished = False
        self.recon_done = False
        self.ports = {
            22: "SSH",
            80: "HTTP",
            443: "HTTPS",
            8080: "Tomcat"
        }
        self.vulnerable_port = 8080
        self.shell_active = False
        self.flag_stolen = False
        self.target_ip = "192.168.12.66"


### modules/recon.py
def run(game, args):
    print("-- WHOIS Lookup...")
    print("    Organization: FirewallCorp AI Security")
    print("    ASN: 34567")
    print("    Net Range: 192.168.12.0/24")

    print("\n-- DNS Records...")
    print(f"    A record: {game.target_ip}")
    print("    MX record: mail.firewallcorp.ai")

    print("\n-- OSINT Notes:")
    print("    - CVE-2017-12615 on Tomcat")
    print("    - Developer email leaked: root@corp.ai")
    game.recon_done = True


### modules/scanner.py
def run(game, args):
    print(f"-- Starting scan on target {game.target_ip}...")
    for port, service in game.ports.items():
        print(f"    Port {port}/tcp: OPEN ({service})")
    print("-- Scan complete.")


### modules/enumerator.py
def run(game, args):
    if not args:
        print("[-] Usage: enum --target <ip:port>")
        return
    print("-- Grabbing banners...")
    print("    Apache Tomcat/7.0.81 - Vulnerable to CVE-2017-12615")
    print("    OS: Linux - Kernel 4.15")
    print("-- Enumeration complete.")


### modules/exploiter.py
def run(game, args):
    print("-- Deploying exploit to Tomcat...")
    if game.vulnerable_port == 8080:
        print("    Upload success! Backdoor.jsp deployed.")
        game.shell_active = True
    else:
        print("[-] Exploit failed. Try a different target or payload.")


def inject(game, args):
    print("-- Injecting payload with firewall bypass attempt...")
    print("    Payload appears to have evaded basic filters.")


def tunnel(game, args):
    print("-- Establishing SSH tunnel...")
    print("    Tunnel active. Forwarding traffic through localhost:9000")


def shell(game):
    if not game.shell_active:
        print("[-] No active shell session. Exploit the system first.")
        return

    print("-- Interactive shell established. Type 'exit' to quit.")
    while True:
        cmd = input("shell$ ")
        if cmd.strip() == "exit":
            print("-- Shell session closed.")
            break
        elif cmd.strip() == "ls":
            print("flag.txt  backdoor.jsp  logs/")
        elif cmd.strip() == "cat flag.txt":
            print("FLAG{firewall_evaded_successfully}")
            game.flag_stolen = True
        else:
            print(f"sh: {cmd}: command not found")