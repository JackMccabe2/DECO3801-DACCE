import random
import time

firewall_config = {
    "firewall_type": "Next-Gen Deep Packet Inspection",
    "open_ports": [22, 80, 443],
    "vulnerabilities": {
        "CVE-2023-44256": "OpenSSH User Enumeration",
        "CVE-2024-11823": "TLS Downgrade Exploit",
        "CVE-2022-99813": "Misconfigured Admin Console"
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
    slow_print(f"-- Open Ports: {', '.join(str(p) for p in firewall_config['open_ports'])}")
    slow_print(f"-- IDS Status: {'ENABLED' if firewall_config['intrusion_detection'] else 'DISABLED'}")

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
