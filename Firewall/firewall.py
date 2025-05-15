import random
import time
import ipaddress
import re

firewall_breached = False
info_retrieved = False
found_vulnerabilities = set()

firewall_config = {
    "firewall_type": "Next-Gen Deep Packet Inspection",
    "open_ports": [22, 80, 443, 3306],
        "services": {
        80:  {
            "name": "http",
            "version": "Apache 2.4.52",
            "vulns": ["CVE-2024-11823"],
            "frameworks": {                      
                "WordPress": "5.7.2",
                "jQuery": "1.11.3"
            }
        },
        443: {
            "name": "https",
            "version": "nginx 1.21.6",
            "vulns": ["CVE-2022-99813"],
            "frameworks": {
                "Django": "3.2.5",
                "Bootstrap": "4.6.0"
            }
        },
    },
    "vulnerabilities": {
        "CVE-2023-44256": "OpenSSH User Enumeration",
        "CVE-2024-11823": "TLS Downgrade Exploit",
        "CVE-2022-99813": "Misconfigured Admin Console",
        "CVE-2023-67890": "MySQL Remote Code Execution"
    },
    "intrusion_detection": True,
    "admin_console": "10.0.0.1",

    "protocols": {
        "SSLv3": True,
        "TLS1.0": True,
        "TLS1.1": True,
    },
    "ciphers": {
        "RSA_EXPORT": True,   # used by FREAK
        "DHE_EXPORT": True,   # used by Logjam
    }
}
FIREWALL_TYPES = [
    "Next-Gen Deep Packet Inspection",
    "Stateful Firewall",
    "Web Application Firewall",
    "Unified Threat Management",
    "Network Address Translation",
    "Proxy Firewall"
]
SERVICE_CATALOG = {
    22: [(
        "ssh",
        ["OpenSSH 7.4", "OpenSSH 8.2", "Dropbear 2019.78"],
        ["CVE-2020-15778", "CVE-2021-41617"],
        {}   # no web frameworks on SSH
    )],
    21: [(
        "ftp",
        ["vsftpd 3.0.3", "ProFTPD 1.3.6"],
        ["CVE-2011-2523", "CVE-2019-12815"],
        {}   # no web frameworks on FTP
    )],
    80: [(
        "http",
        ["Apache 2.2.34", "Apache 2.4.52", "nginx 1.18.0"],
        ["CVE-2021-41773", "CVE-2022-23943"],
        {    # possible HTTP frameworks
            "WordPress": ["5.7.2", "5.8.1", "5.9.3"],
            "jQuery":    ["1.11.3", "3.5.1", "3.6.0"],
            "Drupal":    ["9.2.0", "9.3.5"]
        }
    )],
    443: [(
        "https",
        ["nginx 1.19.6", "nginx 1.21.6", "Apache 2.4.46"],
        ["CVE-2021-31166", "CVE-2022-20862"],
        {    # possible HTTPS frameworks
            "Django":    ["3.1.7", "3.2.5", "3.2.12"],
            "Flask":     ["1.1.2", "2.0.1", "2.1.0"],
            "Express":   ["4.17.1", "4.18.0"]
        }
    )],
    3306: [(
        "mysql",
        ["MySQL 5.7", "MySQL 8.0", "MariaDB 10.5"],
        ["CVE-2020-14750", "CVE-2021-35623"],
        {}   # no web frameworks on DB port
    )],
    1433: [(
        "mssql",
        ["MSSQL 2017", "MSSQL 2019"],
        ["CVE-2020-0618", "CVE-2021-1636"],
        {}   # no web frameworks on DB port
    )],
}
PROTOCOLS = [
    "SSLv3",
    "TLS1.0",
    "TLS1.1",
    "TLS1.2",
    "TLS1.3",     # newest TLS
    "DTLS1.2",    # UDP-based TLS
    "SSH-1.0",    # legacy SSH
    "SSH-2.0",    # modern SSH
    "IPSec",      # VPN / tunneling
    "OpenVPN",
    "WireGuard",
    "HTTP/1.1",   # classic web
    "HTTP/2",
    "HTTP/3",     # over QUIC
    "QUIC",
    "PPTP",       # legacy VPN
    "L2TP",
    "GRE",
    "SNMPv1",     # network management
    "SNMPv2c",
    "SNMPv3"
]
CIPHERS   = ["RSA_EXPORT", "DHE_EXPORT", "ECDHE", "CHACHA20_POLY1305"]

def random_private_ip():
    return str(ipaddress.IPv4Network("10.0.0.0/8").network_address +
               random.randint(1, 2**24 - 2))

def generate_firewall_config():
    # 1) Choose a random firewall type
    fw_type = random.choice(FIREWALL_TYPES)
    
    # 2) Pick a random subset of ports
    num_ports = random.randint(2, 5)
    ports     = random.sample(list(SERVICE_CATALOG.keys()), k=num_ports)
    
    services       = {}
    vulnerabilities = {}
    
    for p in ports:
        # Unpack name, versions, CVEs, and framework pool
        name, versions, cv_list, fw_pool = SERVICE_CATALOG[p][0]
        
        # Random version
        version = random.choice(versions)
        
        # 1–2 random CVEs
        vulns = random.sample(cv_list, k=random.randint(1, min(2, len(cv_list))))
        
        # Random frameworks (50% chance each)
        frameworks = {}
        for fw, vers in fw_pool.items():
            if random.choice([True, False]):
                frameworks[fw] = random.choice(vers)
        
        # Build the service entry
        entry = {
            "name":    name,
            "version": version,
            "vulns":   vulns
        }
        if frameworks:
            entry["frameworks"] = frameworks
        
        services[p] = entry
        
        # Populate the global vulnerabilities map
        for cve in vulns:
            vulnerabilities[cve] = f"{name.upper()} Vulnerability {cve}"
    
    # 3) Random protocol & cipher flags
    protocols = { proto: random.choice([True, True, False]) for proto in PROTOCOLS }
    ciphers   = { cip:   random.choice([True, False])       for cip   in CIPHERS }
    
    # 4) Compose final config
    config = {
        "firewall_type":      fw_type,
        "open_ports":         ports,
        "services":           services,
        "vulnerabilities":    vulnerabilities,
        "intrusion_detection": random.choice([True, False]),
        "admin_console":      random_private_ip(),
        "protocols":          protocols,
        "ciphers":            ciphers
    }
    
    return config

if __name__ == "__main__":
    new_cfg = generate_firewall_config()
    import pprint
    pprint.pprint(new_cfg)

def slow_print(text, delay=0.02):
    for c in text:
        print(c, end='', flush=True)
        time.sleep(delay)
    print()

# GAME FUNCTIONALITY
def scan_network():
    target_ip = firewall_config["admin_console"]
    fw_type   = firewall_config["firewall_type"]
    slow_print("-- Initiating network scan...")
    time.sleep(1)
    slow_print("-- Probing local subnets...")
    time.sleep(1)
    slow_print(f"-- Host {target_ip} responds. Running firewall fingerprint...")
    time.sleep(1)
    slow_print(f"-- Firewall Detected: {fw_type}")

def nmap_scan(command):
    slow_print("-- Initiating Nmap scan...")

    parts = command.split()
    show_versions = (parts[1] == "-sv")
    target_ip     = parts[-1]

    if target_ip != firewall_config["admin_console"]:
        slow_print(f"-- ERROR: Host {target_ip} is not reachable.")
        return

    slow_print(f"-- Scanning host {target_ip}...")
    time.sleep(1)

    for port in firewall_config["open_ports"]:
        if show_versions:
            service = firewall_config["services"].get(port, {"name":"Unknown","version":""})
            slow_print(f"   {target_ip}: {port}/tcp → OPEN → {service['name']} {service['version']}")
        else:
            slow_print(f"   {target_ip}: {port}/tcp → OPEN")

    if firewall_config["intrusion_detection"]:
        slow_print("-- IDS LOG: Suspicious scanning behavior detected. Admin may have been notified.")

def nmap_vuln(command):
    parts = command.split()
    if len(parts) < 5:
        slow_print(f"-- ERROR: Expected 5 arguments, got {len(parts)}. Usage: <cmd> <arg1> <arg2> <arg3> <arg4>")
        return
    
    slow_print("-- Running Nmap vulnerability scan...")
    show_versions = "-sV" in parts  # Optional version details
    target_ip = parts[-3] #if parts[-1].count('.') == 3 else firewall_config["admin_console"]

    web_keywords = ["http", "https", "apache", "nginx", "lighttpd", "iis"]
    is_web_service = False

    for port, service in firewall_config["services"].items():
        version_string = f"{service['name']} {service['version']}".lower()
        if any(kw in version_string for kw in web_keywords):
            if parts[4] in version_string:
                is_web_service = True
                break

    if is_web_service:
        slow_print("-- Nmap script scan does not support detailed HTTP/HTTPS analysis.")
        slow_print("-- Suggestion: Use nikto for web server vulnerability scanning.")
        return


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
        if service_info.lower() in services["version"].lower():
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
                    found_vulnerabilities.add(vuln_key)
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
    parts = command.split()
    ip_match = next((p for p in parts if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", p)), firewall_config["admin_console"])
    port = 80  # Default port
    for p in parts:
        if p.isdigit():
            port = int(p)

    slow_print(f"-- Starting Nikto web scan on {ip_match}:{port}...")
    time.sleep(1)

    svc = firewall_config["services"].get(port)
    if not svc or svc["name"] not in ("http", "https"):
        slow_print(f"   [!] No web server detected on port {port}.")
        return

    findings = []
    detected_cves = []
    version = svc["version"].lower()

    # Heuristic scan (example vulnerabilities)
    if "apache" in version:
        findings.append("Apache directory listing enabled")
        findings.append(f"Server leaks version info: {svc['version']}")
    if "nginx" in version:
        findings.append("Nginx default welcome page exposed")

    # Check for known vulns attached to this web service
    for vuln in svc.get("vulns", []):
        if vuln not in found_vulnerabilities:
            found_vulnerabilities.add(vuln)
            detected_cves.append(vuln)

    # Always assume config issues for realism
    findings.append("Potential misconfiguration in admin console endpoint")

    # Output findings
    if findings:
        slow_print("-- Web security issues identified:")
        for f in findings:
            slow_print(f"   [+] {f}")

    # Output known vulnerabilities (like nmap_vuln does)
    if detected_cves:
        slow_print("-- CVE vulnerabilities identified:")
        for vuln in detected_cves:
            slow_print(f"   {vuln}: {firewall_config['vulnerabilities'][vuln]}")

    else:
        slow_print("-- No known CVE vulnerabilities detected.")

    if firewall_config["intrusion_detection"]:
        slow_print("-- IDS LOG: Nikto scan activity detected. Admin may have been alerted.")

def run_whatweb(command):
    slow_print("-- Fingerprinting web technologies...")
    time.sleep(1)

    # find an HTTP(S) service:
    svc = None
    for port, s in firewall_config["services"].items():
        if s["name"] in ("http","https"):
            svc = s
            break

    if not svc:
        slow_print("   [!] No web server detected to fingerprint.")
        return

    # banner info:
    slow_print(f"   [+] Detected {svc['name'].upper()} → {svc['version']}")

    # framework info:
    frameworks = svc.get("frameworks", {})
    if not frameworks:
        slow_print("   [i] No higher-level frameworks detected.")
    else:
        for fw, ver in frameworks.items():
            slow_print(f"   [+] Detected framework: {fw} → {ver}")
        # suggest an exploit based on framework:
        if "WordPress" in frameworks:
            slow_print("   [!] Hint: try `exploit_wp_rce` next.")
        if "Django" in frameworks:
            slow_print("   [!] Hint: try `exploit_django_ssti` next.")

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

def exploit_wp_rce(command):
    parts = command.split()
    # Expect: exploit_wp_rce <target_ip>
    if len(parts) != 2:
        slow_print("-- ERROR: Usage: exploit_wp_rce <target_ip>")
        return

    target = parts[1]
    if target != firewall_config["admin_console"]:
        slow_print(f"-- ERROR: Host {target} is not reachable.")
        return

    # Optional: refuse if no WordPress
    svc = firewall_config["services"].get(80)
    frameworks = svc.get("frameworks", {}) if svc else {}
    if "WordPress" not in frameworks:
        slow_print("-- ERROR: No WordPress detected on target.")
        return

    global firewall_breached
    if not firewall_breached:
        slow_print("-- Attempting WordPress RCE via plugin…")
        time.sleep(1)
        slow_print("   [+] Exploit succeeded! Shell dropped at /wp-shell.php")
        firewall_breached = True
    else:
        slow_print("-- Already have a shell. No need to re-exploit.")

def exploit_django_ssti(command):
    parts = command.split()
    # Expect: exploit_django_ssti <target_ip>
    if len(parts) != 2:
        slow_print("-- ERROR: Usage: exploit_django_ssti <target_ip>")
        return

    target = parts[1]
    if target != firewall_config["admin_console"]:
        slow_print(f"-- ERROR: Host {target} is not reachable.")
        return

    svc = firewall_config["services"].get(443)
    frameworks = svc.get("frameworks", {}) if svc else {}
    if "Django" not in frameworks:
        slow_print("-- ERROR: No Django application detected on target.")
        return

    global firewall_breached
    if not firewall_breached:
        slow_print("-- Triggering Django template injection…")
        time.sleep(1)
        slow_print("   [+] SSTI exploited, remote code execution achieved.")
        firewall_breached = True
    else:
        slow_print("-- Session already exploited.")


#idea exploits TLS
def exploit_poodle(target_ip):
    slow_print(f"[POODLE] Attempting SSLv3 downgrade on {target_ip}…")
    time.sleep(1)
    if not firewall_config["protocols"]["SSLv3"]:
        slow_print("   ❌ SSLv3 is already disabled—attack fails.")
    else:
        slow_print("   ✅ SSLv3 negotiated. 256 requests to crack a byte…")
        time.sleep(1)
        slow_print("   [+] SUCCESS: decrypted one byte of traffic.")
        firewall_breached = True

def exploit_freak(target_ip):
    slow_print(f"[FREAK] Forcing export-grade RSA on {target_ip}…")
    time.sleep(1)
    if not firewall_config["ciphers"]["RSA_EXPORT"]:
        slow_print("   ❌ Export-grade ciphers disabled—attack fails.")
    else:
        slow_print("   ✅ Server downgraded to 512-bit RSA.")
        time.sleep(1)
        slow_print("   [+] SUCCESS: factored the key, decrypted session.")
        firewall_breached = True

def exploit_logjam(target_ip):
    slow_print(f"[Logjam] Forcing DHE_EXPORT key exchange on {target_ip}…")
    time.sleep(1)
    if not firewall_config["ciphers"]["DHE_EXPORT"]:
        slow_print("   ❌ DHE_EXPORT disabled—attack fails.")
    else:
        slow_print("   ✅ Downgraded to 512-bit Diffie-Hellman.")
        time.sleep(1)
        slow_print("   [+] SUCCESS: cracked DH parameters, MITM possible.")
        firewall_breached = True

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

def print_vulns():
    slow_print("== Discovered Vulnerabilities ==")
    if not found_vulnerabilities:
        slow_print("   None discovered yet.")
    else:
        for cve in sorted(found_vulnerabilities):
            desc = firewall_config["vulnerabilities"].get(cve, "Unknown description")
            slow_print(f"   {cve} → {desc}")