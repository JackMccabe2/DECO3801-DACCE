import random
import time

firewall_config = {
    "firewall_type": "Next-Gen Deep Packet Inspection",
    "open_ports": [22, 80, 443, 3306],
    "services": {
        22: {"name": "ssh", "version": "OpenSSH 8.2", "vulns": ["CVE-2023-44256"]},
        80: {"name": "http", "version": "Apache 2.4.52", "vulns": ["CVE-2024-11823"]},
        443: {"name": "https", "version": "nginx 1.21.6", "vulns": ["CVE-2022-99813"]},
        3306: {"name": "mysql", "version": "MySQL 8.0", "vulns": ["CVE-2023-67890"]}
    },
    "vulnerabilities": {
        "CVE-2023-44256": "OpenSSH User Enumeration",
        "CVE-2024-11823": "TLS Downgrade Exploit",
        "CVE-2022-99813": "Misconfigured Admin Console",
        "CVE-2023-67890": "MySQL Remote Code Execution"
    },
    "intrusion_detection": True,
    "admin_console": "10.0.0.1"
}

firewall_breached = False
info_retrieved = False

def slow_print(text, delay=0.03):
    for c in text:
        print(c, end='', flush=True)
        time.sleep(delay)
    print()

def scan_network():
    slow_print("-- Initiating network scan...")
    time.sleep(1)
    slow_print("-- Probing local subnets...")
    time.sleep(1)
    slow_print("-- Host 10.0.0.1 responds. Running firewall fingerprint...")
    time.sleep(1)
    slow_print("-- Firewall Detected: QuantumNet v3.7")

def nmap_scan(command):
    slow_print("-- Initiating Nmap scan...")

    parts = command.split()
    show_versions = "-sV" in parts
    target_ip = parts[-1] if parts[-1].count('.') == 3 else firewall_config["admin_console"]

    #checks for correct IP
    if target_ip != firewall_config["admin_console"]:
        slow_print(f"-- ERROR: Host {target_ip} is not reachable.")
        return

    slow_print(f"-- Scanning host {target_ip}...")
    time.sleep(1)

    for port in firewall_config["open_ports"]:
        if show_versions:
            service = firewall_config["services"].get(port, "Unknown Service")
            slow_print(f"   {target_ip}: {port}/tcp → OPEN → {service}")
        else:
            slow_print(f"   {target_ip}: {port}/tcp → OPEN")

    if firewall_config["intrusion_detection"]:
        slow_print("-- IDS LOG: Suspicious scanning behavior detected. Admin may have been notified.")

"""
def perform_recon():
    slow_print("-- Running vulnerability assessment on 10.0.0.1...")
    time.sleep(1.5)
    slow_print("-- Enumerating services on open ports...")
    time.sleep(1)
    slow_print("-- Analyzing packet signatures...")
    slow_print("-- Possible vulnerabilities identified:")
    for vuln, desc in firewall_config["vulnerabilities"].items():
        slow_print(f"   {vuln} → {desc}")
    slow_print("-- Note: Exploits may trigger IDS logging.")
"""

def vuln_scan(command):
    slow_print("-- Running Nmap vulnerability scan...")

    parts = command.split()
    show_versions = "-sV" in parts  # Optional version details
    target_ip = parts[-1] if parts[-1].count('.') == 3 else firewall_config["admin_console"]

    if target_ip != firewall_config["admin_console"]:
        slow_print(f"-- ERROR: Host {target_ip} is not reachable.")
        return

    slow_print(f"-- Scanning host {target_ip} for vulnerabilities...")
    time.sleep(1)

    # Extract service name and version from the command
    service_info = " ".join(parts[4:]).strip()  # Join everything after the IP to get the service name and version
    service_parts = service_info.split()  # Split by space to separate name and version

    service_name = service_parts[0]
    service_version = service_parts[1] if len(service_parts) > 1 else None  # Optional version information

    # Check if the service is available in the firewall_config
    services_to_check = []
    for ports, services in firewall_config["services"].items():
        if service_info == services["version"].lower():
            #if service_version is None or service_version in service["version"]:  # Match version if provided
            services_to_check.append(services)

    # check if user entered valid service to check
    if not services_to_check:
        slow_print("-- ERROR: No matching services found for vulnerability scan.")
        return

    found_vulns = []
    # Loop through the ports and services in the firewall_config
    for port, service in firewall_config["services"].items():
        if service == services_to_check[0]:
            for vuln_key in service["vulns"]:
                if vuln_key not in found_vulns:
                    found_vulns.append(vuln_key)
                    if show_versions:
                        slow_print(f"   {target_ip}:{port}/tcp → OPEN → {services['name']} {services['version']} → Vulnerable to {firewall_config['vulnerabilities'][vuln_key]} ({vuln_key})")

    # If vulnerabilities are found, report them
    if found_vulns:
        slow_print("-- Vulnerabilities detected:")
        for vuln in found_vulns:
            slow_print(f"   {vuln}: {firewall_config['vulnerabilities'][vuln]}")
    else:
        slow_print("-- No vulnerabilities detected based on specified services.")

    if firewall_config["intrusion_detection"]:
        slow_print("-- IDS LOG: Vulnerability scan detected. Admin may have been notified.")

"""
What Nikto Scans For:
Outdated software versions (e.g., old Apache, nginx, etc.)
Dangerous files or directories (like /admin, /test, /phpmyadmin)
Misconfigurations (e.g., directory listing enabled)
Default or insecure configurations
Known vulnerabilities (based on a large internal database)

Nikto Limitations:
Only scans web servers (ports like 80, 443)
No stealth, so intrusion detection systems (IDS) usually catch it
Doesnt exploit vulnerabilities; it only reports them
"""
def run_nikto(command):
    slow_print("-- Starting Nikto web scan on 10.0.0.1...")
    time.sleep(1)
    if 80 in firewall_config["services"]:
        slow_print("   [+] Apache directory listing enabled")
        slow_print("   [+] Server leaks version info: Apache 2.4.52")
        slow_print("   [+] Potential misconfiguration in admin console endpoint")
    else:
        slow_print("   [!] No web server detected on default port 80.")

def run_whatweb(command):
    slow_print("-- Fingerprinting web technologies...")
    time.sleep(1)
    for port, svc in firewall_config["services"].items():
        if svc["name"] in ["http", "https"]:
            slow_print(f"   [+] Detected {svc['name'].upper()} → {svc['version']}")


def exploit_vulnerability():
    global firewall_breached
    slow_print("-- Launching exploit tool: `quantum-sploit`")
    time.sleep(1)
    outcome = random.randint(1, 10)
    if firewall_breached:
        slow_print("-- Access already obtained. No further exploit needed.")
        return
    if outcome >= 4:
        firewall_breached = True
        slow_print("-- Exploit injected... waiting for payload execution...")
        time.sleep(1)
        slow_print("-- Payload successful. Admin shell opened at 10.0.0.1:8080")
    else:
        slow_print("-- Exploit attempt failed.")
        if firewall_config["intrusion_detection"]:
            slow_print("-- ALERT: IDS triggered. Admin has been notified.")
        else:
            slow_print("-- No alert raised. IDS is offline.")

def retrieve_data():
    global info_retrieved
    if not firewall_breached:
        slow_print("-- ACCESS DENIED: You must exploit the firewall first.")
        return
    if info_retrieved:
        slow_print("-- Data has already been extracted from this session.")
        return
    slow_print("-- Navigating to /root/secrets.txt on admin console...")
    time.sleep(1)
    slow_print("-- Extracting contents...")
    time.sleep(1)
    slow_print("-- SUCCESS: File contents:")
    print()
    slow_print("    Access Token: QU4N7UM-H31ST-2025")
    slow_print("    Admin Email: root@quantumcorp.net")
    slow_print("    SSH Key Fingerprint: 9f:81:02:cc:1d:fa:13")
    print()
    info_retrieved = True

def reset_firewall():
    global firewall_breached, info_retrieved, firewall_config
    firewall_breached = False
    info_retrieved = False

    firewall_config["vulnerabilities"] = {
        "CVE-2023-44256": "OpenSSH User Enumeration",
        "CVE-2024-11823": "TLS Downgrade Exploit",
        "CVE-2022-99813": "Misconfigured Admin Console"
    }

    slow_print("-- Resetting environment...")
    time.sleep(0.5)
    slow_print("-- Firewall and session state reset.")
